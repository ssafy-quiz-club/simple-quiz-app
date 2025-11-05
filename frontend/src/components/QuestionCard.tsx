import styled from 'styled-components';
import type { Question } from '../types';
import { QuestionBlock } from "./QuestionBlock.tsx";
import { MultipleChoiceCard } from './MultipleChoiceCard';
import { TrueFalseCard } from './TrueFalseCard';
import { ShortAnswerCard } from './ShortAnswerCard';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  picked: number | undefined;
  onChoiceClick: (choiceIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

export function QuestionCard({
  question, currentIndex, totalQuestions, picked,
  onChoiceClick, onPrev, onNext, onReset
}: QuestionCardProps) {
  const percent = (currentIndex / (totalQuestions - 1)) * 100;
  const isAnswered = picked !== undefined;

  // questionType 결정 (기본값: MULTIPLE_CHOICE)
  const questionType = (question as any).questionType || 'MULTIPLE_CHOICE';

  return (
    <>
      <Progress aria-label="진행도">
        <Bar style={{ width: `${percent}%` }} />
      </Progress>

      <QuestionBlock content={question.question} />

      {/* 문제 유형에 따라 다른 컴포넌트 렌더링 */}
      {questionType === 'MULTIPLE_CHOICE' && (
        <MultipleChoiceCard
          question={question}
          picked={picked}
          onChoiceClick={onChoiceClick}
        />
      )}

      {questionType === 'TRUE_FALSE' && (
        <TrueFalseCard
          question={question}
          picked={picked}
          onChoiceClick={onChoiceClick}
        />
      )}

      {questionType === 'SHORT_ANSWER' && (
        <ShortAnswerCard
          question={question}
          picked={picked}
          onChoiceClick={onChoiceClick}
        />
      )}

      <Footer>
        <Btn onClick={onPrev} disabled={currentIndex === 0}>이전</Btn>
        <FooterRight>
          {isAnswered && (
            <BtnReset onClick={onReset}>초기화</BtnReset>
          )}
          <BtnPrimary onClick={onNext} disabled={!isAnswered}>
            {currentIndex === totalQuestions - 1 ? '결과보기' : '다음'}
          </BtnPrimary>
        </FooterRight>
      </Footer>
    </>
  );
}

/* ------------ styled ------------ */

const Progress = styled.div`
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #0e1628;
  border: 1px solid #2b3a52;
  margin: 10px 0 14px;
  position: relative;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.35);
`;

const Bar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #2a6df3, #26c26a);
  box-shadow: 0 0 12px rgba(38,194,106,.35);
  transition: width .25s ease;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Btn = styled.button`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #2e3a4d;
  background: #0d1322;
  color: #e8edf3;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);

  &:hover {
    border-color: #435269;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,.35);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0,0,0,.3);
  }
  &:disabled {
    opacity: .55;
    cursor: not-allowed;
  }
`;

const BtnReset = styled(Btn)`
  background: #1a1f2e;
  border-color: #374151;

  &:hover {
    background: #252b3d;
    border-color: #4b5563;
  }
`;

const BtnPrimary = styled(Btn)`
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  border-color: #1f4fb8;
`;
