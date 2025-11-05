import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Question } from '../types';

interface TrueFalseCardProps {
  question: Question;
  picked: number | undefined;
  onChoiceClick: (choiceIndex: number) => void;
}

export function TrueFalseCard({ question, picked, onChoiceClick }: TrueFalseCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const isAnswered = picked !== undefined;
  const isCorrect = isAnswered && picked === question.answer;

  const handleClick = (choiceIndex: number) => {
    if (!isAnswered) {
      onChoiceClick(choiceIndex);
      setShowExplanation(true);
    }
  };

  return (
    <>
      <TrueFalseContainer>
        <TrueFalseButton
          $state={isAnswered && picked === 0 ? (0 === question.answer ? 'correct' : 'wrong') : 'default'}
          onClick={() => handleClick(0)}
          disabled={isAnswered}
        >
          O
        </TrueFalseButton>
        <TrueFalseButton
          $state={isAnswered && picked === 1 ? (1 === question.answer ? 'correct' : 'wrong') : 'default'}
          onClick={() => handleClick(1)}
          disabled={isAnswered}
        >
          X
        </TrueFalseButton>
      </TrueFalseContainer>

      {isAnswered && showExplanation && question.explanation && (
        <ExplanationBox onClick={() => setShowExplanation(!showExplanation)}>
          <ExplainBadge $ok={isCorrect}>
            {isCorrect ? '정답' : '오답'}
          </ExplainBadge>
          <ExplanationText>{question.explanation}</ExplanationText>
        </ExplanationBox>
      )}

      {isAnswered && question.explanation && (
        <ClickHint onClick={() => setShowExplanation(!showExplanation)}>
          {showExplanation ? '해설 숨기기 ▲' : '해설 보기 ▼'}
        </ClickHint>
      )}
    </>
  );
}

/* Styled Components */

const TrueFalseContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
`;

const TrueFalseButton = styled.button<{ $state: 'correct' | 'wrong' | 'default' }>`
  min-height: 120px;
  font-size: 48px;
  font-weight: 700;
  border-radius: 16px;
  border: 2px solid #2e3a4d;
  background: #0d1322;
  color: #e8edf3;
  cursor: pointer;
  transition: all .12s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);

  &:hover:not(:disabled) {
    border-color: #435269;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ $state }) => $state === 'correct' && css`
    border-color: #14532d;
    background: #0b2d19;
    color: #22c55e;
  `}

  ${({ $state }) => $state === 'wrong' && css`
    border-color: #7f1d1d;
    background: #2a0f0f;
    color: #ef4444;
  `}
`;

const ExplanationBox = styled.div`
  margin-top: 20px;
  padding: 16px 18px;
  border-radius: 12px;
  background: #0d1322;
  border: 1px solid #2e3a4d;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: border-color .12s ease;

  &:hover {
    border-color: #435269;
  }
`;

const ExplainBadge = styled.span<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 24px;
  padding: 0 10px;
  font-weight: 700;
  font-size: 11px;
  border-radius: 999px;
  border: 1px solid ${({ $ok }) => ($ok ? '#166534' : '#991b1b')};
  background: ${({ $ok }) => ($ok ? '#065f46' : '#7f1d1d')};
  flex-shrink: 0;
`;

const ExplanationText = styled.div`
  flex: 1;
  line-height: 1.6;
  color: #e8edf3;
`;

const ClickHint = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #cbd5e1;
  }
`;
