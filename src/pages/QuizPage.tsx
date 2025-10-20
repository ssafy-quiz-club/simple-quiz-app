import { useState, useEffect, useMemo } from 'react';
import '../css/index.css';
import quizDataJson from '../assets/ai_ml_basics_v1.json';
import type { QuizData } from '../types';

import { Header } from '../components/Header';
import { Navigator } from '../components/Navigator';
import { QuestionCard } from '../components/QuestionCard';
import { Results } from '../components/Results';

// 유틸리티 함수
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

const STORAGE_KEY = "quiz_state_v3_ai_ml_react";
const quizData: QuizData = quizDataJson;

function QuizPage() {
  // 상태 관리
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  // 상태 복원 (최초 1회)
  useEffect(() => {
    const rawState = localStorage.getItem(STORAGE_KEY);
    const savedState = rawState ? JSON.parse(rawState) : null;
    
    const initialOrder = savedState?.order && savedState.order.length === quizData.questions.length 
      ? savedState.order 
      : shuffle([...Array(quizData.questions.length).keys()]);

    setOrder(initialOrder);
    if (savedState) {
      setIndex(clamp(savedState.index || 0, 0, initialOrder.length - 1));
      setPicks(savedState.picks || {});
      setFinished(savedState.finished || false);
    }
  }, []);

  // 상태 저장
  useEffect(() => {
    const stateToSave = { order, index, picks, finished };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [order, index, picks, finished]);

  // 파생 상태
  const score = useMemo(() => {
    return order.reduce((acc, qIdx) => {
      const q = quizData.questions[qIdx];
      return acc + (picks[q.id] === q.answer ? 1 : 0);
    }, 0);
  }, [picks, order]);

  const currentQ = quizData.questions[order[index]];
  const totalQuestions = quizData.questions.length;

  // 이벤트 핸들러
  const handleChoiceClick = (choiceIndex: number) => {
    if (!currentQ || picks[currentQ.id] !== undefined) return;
    setPicks(prev => ({ ...prev, [currentQ.id]: choiceIndex }));
  };

  const handleNext = () => {
    if (index === totalQuestions - 1) {
      setFinished(true);
    } else {
      setIndex(prev => clamp(prev + 1, 0, totalQuestions - 1));
      setFinished(false);
    }
  };

  const handlePrev = () => {
    setIndex(prev => clamp(prev - 1, 0, totalQuestions - 1));
    setFinished(false);
  };
  
  const handleNavClick = (newIndex: number) => {
    setIndex(newIndex);
    setFinished(false);
  };

  const handleReset = () => {
    if (!confirm("진행을 초기화할까요?")) return;
    setPicks({});
    setIndex(0);
    setFinished(false);
  };

  const handleShuffle = () => {
    if (!confirm("문항 순서를 재섞고 진행을 초기화합니다.")) return;
    setOrder(shuffle([...Array(totalQuestions).keys()]));
    setPicks({});
    setIndex(0);
    setFinished(false);
  };

  // 렌더링
  if (!currentQ) {
    return <div className="container"><div className="card"><h1>퀴즈 로딩 중…</h1></div></div>;
  }

  return (
    <>
      <div className="container">
        <div className="card">
          <Header 
            title={quizData.meta.title}
            currentIndex={index}
            totalQuestions={totalQuestions}
            score={score}
            onReset={handleReset}
            onShuffle={handleShuffle}
          />
          <QuestionCard 
            question={currentQ}
            currentIndex={index}
            totalQuestions={totalQuestions}
            picked={picks[currentQ.id]}
            onChoiceClick={handleChoiceClick}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          {finished && (
            <Results 
              score={score}
              totalQuestions={totalQuestions}
              order={order}
              questions={quizData.questions}
              picks={picks}
            />
          )}
        </div>
      </div>

      <Navigator 
        order={order}
        questions={quizData.questions}
        picks={picks}
        currentIndex={index}
        onNavClick={handleNavClick}
      />
    </>
  );
}

export default QuizPage;