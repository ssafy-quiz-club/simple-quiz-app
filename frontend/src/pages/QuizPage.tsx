// src/pages/QuizPage.tsx
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import quizDataJson from '../assets/ai_ml_basics_v1.json';
import type { UiQuizData, UiQuestion, Lecture, ApiQuestionDto } from '../types';

import { Header } from '../components/Header';
import { Navigator } from '../components/Navigator';
import { QuestionCard } from '../components/QuestionCard';
import { Results } from '../components/Results';

import { getLectures } from '../services/lectureService';
import { getQuestionsByLecture } from '../services/questionService';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const STORAGE_KEY = 'quiz_state_v3_ai_ml_react';
const STORAGE_LECTURE = 'selected_lecture_id';

// 초기 기본(로컬) 데이터
const fallbackData: UiQuizData = {
  meta: { title: (quizDataJson as any).meta?.title ?? '퀴즈' },
  questions: (quizDataJson as any).questions?.map((q: any) => ({
    id: q.id,
    prompt: q.question ?? q.prompt ?? q.content,
    choices: q.choices ?? [],
    answer: q.answer ?? 0,
  })) ?? [],
};

function mapApiQuestionsToUi(questions: ApiQuestionDto[]): UiQuestion[] {
  return questions.map((q) => {
    // 보기 텍스트 추출: content 또는 text 중 존재하는 필드를 사용
    const choices = (q.answers ?? []).map(a => (a.content ?? a.text ?? '').toString());

    // 정답 인덱스: correct === true인 첫 번째 보기의 index, 없으면 0
    const answerIndex = Math.max(
      0,
      (q.answers ?? []).findIndex(a => a.correct === true)
    );

    return {
      id: q.id,
      prompt: q.content,
      choices,
      answer: answerIndex === -1 ? 0 : answerIndex,
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

  // 동적으로 채운 퀴즈 데이터 (없으면 fallback 사용)
  const [dynData, setDynData] = useState<UiQuizData | null>(null);

  // 현재 사용하는 데이터 소스
  const data: UiQuizData = dynData ?? fallbackData;

  const keyOf = (id: string | number) => String(id);

  // ===== 최초 로드: 진행 상태/순서 복구 + 강의 목록 불러오기 =====
  useEffect(() => {
    // 로컬 진행 상태 복구
    const rawState = localStorage.getItem(STORAGE_KEY);
    const saved = rawState ? JSON.parse(rawState) : null;

    const initialOrder =
      saved?.order && saved.order.length === data.questions.length
        ? saved.order
        : shuffle([...Array(data.questions.length).keys()]);

    setOrder(initialOrder);
    if (saved) {
      setIndex(clamp(saved.index ?? 0, 0, initialOrder.length - 1));
      setPicks(saved.picks ?? {});
      setFinished(saved.finished ?? false);
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const uiQs = mapApiQuestionsToUi(qs);
        const nextData: UiQuizData = {
          meta: {
            title:
              `강의: ${
                lectures.find(l => l.id === selectedLectureId)?.name ?? selectedLectureId
              }`,
          },
          questions: uiQs,
        };

        setDynData(nextData);

        // 진행 상태 초기화 (강의 전환 시)
        const nextOrder = shuffle([...Array(nextData.questions.length).keys()]);
        setOrder(nextOrder);
        setIndex(0);
        setPicks({});
        setFinished(false);
      } catch (err: any) {
        if (!mounted) return;
        setErrorQuestions(err?.message || '문제를 불러오지 못했습니다.');
        // 실패 시 이전 데이터는 유지 (fallbackData 또는 직전 dynData)
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
  return order.reduce((acc, qIdx) => {
      const q = data.questions[qIdx];
      return acc + ((picks[keyOf(q.id)] ?? -1) === q.answer ? 1 : 0);
    }, 0);
  }, [picks, order, data]);

  const currentQ = data.questions[order[index]];
  const totalQuestions = data.questions.length;

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

  // ===== 로딩/에러 UI =====
  if (!currentQ) {
    return (
      <Page>
        <Main>
          <ContentCard>
            <h1>퀴즈 로딩 중…</h1>
            {loadingLectures && <p>강의 목록을 불러오는 중…</p>}
            {errorLectures && <ErrorText>{errorLectures}</ErrorText>}
            {loadingQuestions && selectedLectureId != null && <p>문제를 불러오는 중…</p>}
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
            value={selectedLectureId ?? ''}
            onChange={handleLectureChange}
            disabled={loadingLectures || loadingQuestions}
          >
            {loadingLectures && <option value="">불러오는 중…</option>}
            {!loadingLectures && !lectures.length && <option value="">강의 없음</option>}
            {!loadingLectures && lectures.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          {(errorLectures || errorQuestions) && (
            <ErrorText role="alert">{errorLectures ?? errorQuestions}</ErrorText>
          )}
        </LectureBar>

        <Header
          title={data.meta.title}
          currentIndex={index}
          totalQuestions={totalQuestions}
          score={score}
          onReset={handleReset}
          onShuffle={handleShuffle}
        />
      </TopHeader>

      <Main>
        <Article aria-labelledby="quiz-article-title">
          <h2 id="quiz-article-title" style={{ position:'absolute', left:-9999, top:'auto' }}>퀴즈</h2>

          <ContentCard as="section" aria-label="퀴즈 본문">
            <QuestionCard
              // QuestionCard는 기존 구조를 그대로 사용
              // prompt/choices/answer를 가진 currentQ를 넘김
              question={{
                id: currentQ.id,
                // 컴포넌트에 따라 prop명이 다르면 내부에서 맞춰주세요.
                question: (currentQ as any).question ?? currentQ.prompt,
                prompt: currentQ.prompt,
                choices: currentQ.choices,
                answer: currentQ.answer,
              }}
              currentIndex={index}
              totalQuestions={totalQuestions}
              picked={picks[currentQ.id]}
              onChoiceClick={handleChoiceClick}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </ContentCard>

          {finished && (
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
            <Navigator
              order={order}
              questions={data.questions as any}
              picks={picks}
              currentIndex={index}
              onNavClick={handleNavClick}
            />
          </Sticky>
        </Sidebar>
      </Main>
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
