// src/pages/QuizPage.tsx
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import type { UiQuizData, UiQuestion, Lecture, ApiQuestionDto } from '../types';

import { Header } from '../components/Header';
import { Navigator } from '../components/Navigator';
import { QuestionCard } from '../components/QuestionCard';
import { Results } from '../components/Results';
import { UploadModal } from '../components/UploadModal';
import { LoadingSpinner } from '../components/LoadingSpinner';

import { getLectures } from '../services/lectureService';
import { getQuestionsByLecture } from '../services/questionService';
import { fyShuffle, shuffleChoicesForUiQuestion } from '../utils/shuffle';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const STORAGE_KEY = 'quiz_state_v3_ai_ml_react';
const STORAGE_LECTURE = 'selected_lecture_id';

function mapApiQuestionsToUi(questions: ApiQuestionDto[]): UiQuestion[] {
  return questions.map((q) => {
    const choices = (q.answers ?? []).map(a => (a.content ?? a.text ?? '').toString());
    const answerIndex = Math.max(0, (q.answers ?? []).findIndex(a => a.correct === true));

    // 각 Answer의 explanation을 모아서 조합 (번호와 함께)
    const explanationParts = (q.answers ?? [])
      .map((a, idx) => a.explanation ? `${idx + 1}. ${a.explanation}` : null)
      .filter(Boolean);
    const explanation = explanationParts.length > 0 ? explanationParts.join('\n') : undefined;

    return {
      id: q.id,
      prompt: q.content,
      choices,
      answer: answerIndex === -1 ? 0 : answerIndex,
      explanation,
    };
  });
}

function QuizPage() {
  // ===== 퀴즈 진행 상태 =====
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  type PickMap = Record<string, number>;
  const [picks, setPicks] = useState<PickMap>({});
  const [finished, setFinished] = useState(false);

  // ===== 강의 / 문제 API 상태 =====
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errorLectures, setErrorLectures] = useState<string | null>(null);
  const [errorQuestions, setErrorQuestions] = useState<string | null>(null);

  // 동적으로 채운 퀴즈 데이터
  const [dynData, setDynData] = useState<UiQuizData | null>(null);

  // ===== 업로드 모달 상태 =====
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 현재 사용하는 데이터 소스
  const data: UiQuizData | null = dynData;

  const keyOf = (id: string | number) => String(id);

  // ===== 최초 로드: 강의 목록 불러오기 =====
  useEffect(() => {
    // 강의 선택 복구
    const savedLecture = localStorage.getItem(STORAGE_LECTURE);
    if (savedLecture) {
      setSelectedLectureId(Number(savedLecture));
    }

    // 강의 목록 로드
    let mounted = true;
    (async () => {
      setLoadingLectures(true);
      setErrorLectures(null);
      try {
        const list = await getLectures();
        if (!mounted) return;
        setLectures(list);

        // 선택 없으면 첫 강의 자동 세팅
        if (list.length && savedLecture == null) {
          setSelectedLectureId(list[0].id);
          localStorage.setItem(STORAGE_LECTURE, String(list[0].id));
        }
      } catch (err: any) {
        if (!mounted) return;
        setErrorLectures(err?.message || '강의 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoadingLectures(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // ===== 진행 상태 저장 =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, index, picks, finished }));
  }, [order, index, picks, finished]);

  // ===== 선택한 강의가 바뀌면 문제 로드 =====
  useEffect(() => {
    if (selectedLectureId == null) return;

    let mounted = true;
    (async () => {
      setLoadingQuestions(true);
      setErrorQuestions(null);
      try {
        const qs = await getQuestionsByLecture(selectedLectureId);
        if (!mounted) return;

        // 1) API → UI 매핑
        const uiQs = mapApiQuestionsToUi(qs);

        // 2) 보기(choices) 먼저 셔플 + 정답 인덱스 보정
        const shuffledUiQs = uiQs.map(shuffleChoicesForUiQuestion);

        // 3) 랜덤 30개 선택 (문제가 30개보다 많으면)
        const selectedQuestions = shuffledUiQs.length > 30
          ? fyShuffle([...shuffledUiQs]).slice(0, 30)
          : shuffledUiQs;

        // 4) dynData 세팅
        const nextData: UiQuizData = {
          meta: {
            title: `강의: ${lectures.find(l => l.id === selectedLectureId)?.name ?? selectedLectureId}`,
          },
          questions: selectedQuestions,
        };
        setDynData(nextData);

        // 5) 문항 순서(order) 셔플
        const nextOrder = fyShuffle([...Array(nextData.questions.length).keys()]);
        setOrder(nextOrder);
        setIndex(0);
        setPicks({});
        setFinished(false);
      } catch (err: unknown) {
        if (!mounted) return;

        if (err instanceof Error) {
          setErrorQuestions(err.message);
        } else {
          setErrorQuestions('문제를 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) setLoadingQuestions(false);
      }
    })();

    return () => { mounted = false; };
  }, [selectedLectureId, lectures]);

  // ===== 드롭다운 변경 =====
  const handleLectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = Number(e.target.value);
    const next = Number.isNaN(v) ? null : v;
    setSelectedLectureId(next);
    if (next != null) localStorage.setItem(STORAGE_LECTURE, String(next));
  };

  // ===== 점수/현재문항 =====
  const score = useMemo(() => {
    if (!data) return 0;
    return order.reduce((acc, qIdx) => {
      const q = data.questions[qIdx];
      return acc + ((picks[keyOf(q.id)] ?? -1) === q.answer ? 1 : 0);
    }, 0);
  }, [picks, order, data]);

  const currentQ = data ? data.questions[order[index]] : undefined;
  const totalQuestions = data ? data.questions.length : 0;

  const handleChoiceClick = (choiceIndex: number) => {
    if (!currentQ || picks[keyOf(currentQ.id)] !== undefined) return;
    setPicks(prev => ({ ...prev, [keyOf(currentQ.id)]: choiceIndex }));
  };

  const handleNext = () => {
    if (index === totalQuestions - 1) setFinished(true);
    else { setIndex(prev => clamp(prev + 1, 0, totalQuestions - 1)); setFinished(false); }
  };

  const handlePrev = () => { setIndex(prev => clamp(prev - 1, 0, totalQuestions - 1)); setFinished(false); };
  const handleNavClick = (newIndex: number) => { setIndex(newIndex); setFinished(false); };

  const handleReset = () => {
    if (!confirm('진행을 초기화할까요?')) return;
    setPicks({}); setIndex(0); setFinished(false);
  };

  const handleShuffle = () => {
    if (!confirm('문항 순서를 재섞고 진행을 초기화합니다.')) return;
    setOrder(shuffle([...Array(totalQuestions).keys()])); setPicks({}); setIndex(0); setFinished(false);
  };

  const handleUploadSuccess = () => {
    // 업로드 성공 후 현재 강의 문제 다시 로드
    if (selectedLectureId != null) {
      setSelectedLectureId(selectedLectureId); // useEffect 트리거
    }
  };

  // ===== 로딩/에러 UI =====
  if (loadingLectures || loadingQuestions) {
    return (
      <Page>
        <Main>
          <ContentCard>
            <LoadingSpinner
              message={
                loadingLectures
                  ? '강의 목록을 불러오는 중...'
                  : '문제를 불러오는 중...'
              }
            />
          </ContentCard>
          <Sidebar aria-hidden />
        </Main>
      </Page>
    );
  }

  if (!currentQ) {
    return (
      <Page>
        <Main>
          <ContentCard>
            <h1>퀴즈를 불러올 수 없습니다</h1>
            {errorLectures && <ErrorText>{errorLectures}</ErrorText>}
            {errorQuestions && <ErrorText>{errorQuestions}</ErrorText>}
          </ContentCard>
          <Sidebar aria-hidden />
        </Main>
      </Page>
    );
  }

  return (
    <Page>
      <TopHeader>
        {/* 강의 선택 드롭다운 */}
        <LectureBar>
          <label htmlFor="lecture-select">강의</label>
          <select
            id="lecture-select"
            value={selectedLectureId != null ? String(selectedLectureId) : ""}  // 🔁 문자열로
            onChange={(e) => {
              const v = e.target.value;                      // 🔁 문자열
              const next = v === "" ? null : Number(v);      // "" → null, 그 외 숫자 변환
              setSelectedLectureId(next);
              if (next != null) localStorage.setItem(STORAGE_LECTURE, String(next));
              else localStorage.removeItem(STORAGE_LECTURE);
            }}
            disabled={loadingLectures}  // ✅ 질문 로딩과 무관하게 선택 가능
          >
            {/* 선택 안내용 placeholder */}
            <option value="" disabled hidden>강의 선택</option>
            {lectures.map((l) => (
              <option key={l.id} value={String(l.id)}> {/* 🔁 문자열로 */}
                {l.name}
              </option>
            ))}
          </select>
          {(errorLectures || errorQuestions) && (
            <ErrorText role="alert">{errorLectures ?? errorQuestions}</ErrorText>
          )}
        </LectureBar>

        <Header
          title={data?.meta.title ?? '퀴즈'}
          currentIndex={index}
          totalQuestions={totalQuestions}
          score={score}
          onReset={handleReset}
          onShuffle={handleShuffle}
          onUpload={() => setShowUploadModal(true)}
        />
      </TopHeader>

      <Main>
        <Article aria-labelledby="quiz-article-title">
          <h2 id="quiz-article-title" style={{ position: 'absolute', left: -9999, top: 'auto' }}>퀴즈</h2>

          <ContentCard as="section" aria-label="퀴즈 본문">
            <QuestionCard
              question={{
                id: currentQ.id,
                question: (currentQ as any).question ?? currentQ.prompt,
                prompt: currentQ.prompt,
                choices: currentQ.choices,
                answer: currentQ.answer,
                explanation: (currentQ as any).explanation, // ✅ 전달
              }}
              currentIndex={index}
              totalQuestions={totalQuestions}
              picked={picks[keyOf(currentQ.id)]}          // ← 키 일관성
              onChoiceClick={handleChoiceClick}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </ContentCard>

          {finished && data && (
            <ContentCard as="section" aria-label="결과">
              <Results
                score={score}
                totalQuestions={totalQuestions}
                order={order}
                questions={data.questions as any}
                picks={picks}
              />
            </ContentCard>
          )}
        </Article>

        <Sidebar aria-label="문항 네비게이터">
          <Sticky>
            {data && (
              <Navigator
                order={order}
                questions={data.questions as any}
                picks={picks}
                currentIndex={index}
                onNavClick={handleNavClick}
              />
            )}
          </Sticky>
        </Sidebar>
      </Main>

      {showUploadModal && (
        <UploadModal
          lectures={lectures}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </Page>
  );
}

export default QuizPage;

/* ===== styled ===== */
const Page = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
`;
const TopHeader = styled.header`
  margin-bottom: 16px;
  display: grid;
  gap: 10px;
`;
const LectureBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    font-size: 14px;
    color: #cbd5e1;
  }
  select {
    background: #111827;
    color: #e5e7eb;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 16px;
  }
`;
const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
`;
const Main = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;
const Article = styled.article`
  display: grid;
  gap: 16px;
`;
const ContentCard = styled.section`
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
`;
const Sidebar = styled.aside`
  @media (max-width: 980px) {
    order: -1;
  }
`;
const Sticky = styled.div`
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow: auto;
`;
