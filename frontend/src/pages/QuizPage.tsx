import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import quizDataJson from '../assets/ai_ml_basics_v1.json';
import type { QuizData, Lecture } from '../types';
import { Header } from '../components/Header';
import { Navigator } from '../components/Navigator';
import { QuestionCard } from '../components/QuestionCard';
import { Results } from '../components/Results';
import { getLectures } from '../services/lectureService';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const STORAGE_KEY = 'quiz_state_v3_ai_ml_react';
const STORAGE_LECTURE = 'selected_lecture_id';
const quizData: QuizData = quizDataJson;

function QuizPage() {
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  // 🔽 강의 선택 상태
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [lecturesError, setLecturesError] = useState<string | null>(null);

  // 최초 로드: 진행 상태/순서 및 강의 선택 복구
  useEffect(() => {
    const rawState = localStorage.getItem(STORAGE_KEY);
    const saved = rawState ? JSON.parse(rawState) : null;

    const initialOrder =
      saved?.order && saved.order.length === quizData.questions.length
        ? saved.order
        : shuffle([...Array(quizData.questions.length).keys()]);

    setOrder(initialOrder);
    if (saved) {
      setIndex(clamp(saved.index || 0, 0, initialOrder.length - 1));
      setPicks(saved.picks || {});
      setFinished(saved.finished || false);
    }

    const savedLecture = localStorage.getItem(STORAGE_LECTURE);
    if (savedLecture) setSelectedLectureId(Number(savedLecture));
  }, []);

  // 진행 상태 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, index, picks, finished }));
  }, [order, index, picks, finished]);

  // 강의 목록 불러오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLecturesLoading(true);
      setLecturesError(null);
      try {
        const list = await getLectures();
        if (!mounted) return;
        setLectures(list);

        // 선택이 없으면 첫 강의 자동 선택
        if (list.length && selectedLectureId == null) {
          setSelectedLectureId(list[0].id);
          localStorage.setItem(STORAGE_LECTURE, String(list[0].id));
        }
      } catch (err: any) {
        if (!mounted) return;
        setLecturesError(err?.message || '강의 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLecturesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []); // 최초 1회

  // 강의 변경
  const handleLectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const next = Number.isNaN(value) ? null : value;
    setSelectedLectureId(next);
    if (next != null) {
      localStorage.setItem(STORAGE_LECTURE, String(next));
    } else {
      localStorage.removeItem(STORAGE_LECTURE);
    }

    // TODO: 선택한 lectureId로 문제를 API에서 가져오려면 여기에 로직 추가
    // 예:
    // fetchQuestionsByLecture(next!).then((data) => {
    //   setQuizData(data);
    //   setOrder(shuffle([...Array(data.questions.length).keys()]));
    //   setPicks({});
    //   setIndex(0);
    //   setFinished(false);
    // });
  };

  const score = useMemo(() => {
    return order.reduce((acc, qIdx) => {
      const q = quizData.questions[qIdx];
      return acc + (picks[q.id] === q.answer ? 1 : 0);
    }, 0);
  }, [picks, order]);

  const currentQ = quizData.questions[order[index]];
  const totalQuestions = quizData.questions.length;

  const handleChoiceClick = (choiceIndex: number) => {
    if (!currentQ || picks[currentQ.id] !== undefined) return;
    setPicks(prev => ({ ...prev, [currentQ.id]: choiceIndex }));
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

  if (!currentQ) {
    return (
      <Page>
        <Main>
          <ContentCard><h1>퀴즈 로딩 중…</h1></ContentCard>
          <Sidebar aria-hidden />
        </Main>
      </Page>
    );
  }

  return (
    <Page>
      <TopHeader>
        {/* 🔽 강의 드롭다운 */}
        <LectureBar>
          <label htmlFor="lecture-select">강의</label>
          <select
            id="lecture-select"
            value={selectedLectureId ?? ''}
            onChange={handleLectureChange}
            disabled={lecturesLoading}
          >
            {lecturesLoading && <option value="">불러오는 중…</option>}
            {!lecturesLoading && !lectures.length && <option value="">강의 없음</option>}
            {!lecturesLoading && lectures.map((lec) => (
              <option key={lec.id} value={lec.id}>{lec.name}</option>
            ))}
          </select>

          {lecturesError && <SmallError role="alert">{lecturesError}</SmallError>}
        </LectureBar>

        <Header
          title={quizData.meta.title}
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
              question={currentQ}
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
                questions={quizData.questions}
                picks={picks}
              />
            </ContentCard>
          )}
        </Article>

        <Sidebar aria-label="문항 네비게이터">
          <Sticky>
            <Navigator
              order={order}
              questions={quizData.questions}
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
const SmallError = styled.span`
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
