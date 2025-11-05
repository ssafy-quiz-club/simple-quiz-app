import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Question } from '../types';

interface MultipleChoiceCardProps {
  question: Question;
  picked: number | undefined;
  onChoiceClick: (choiceIndex: number) => void;
}

function ChoiceCard({
  choice,
  choiceIndex,
  label,
  isAnswered,
  isCorrect,
  isPicked,
  explanation,
  onClick
}: {
  choice: string;
  choiceIndex: number;
  label: string;
  isAnswered: boolean;
  isCorrect: boolean;
  isPicked: boolean;
  explanation?: string;
  onClick: () => void;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const state: 'correct' | 'wrong' | 'default' =
    isAnswered && isPicked ? (isCorrect ? 'correct' : 'wrong') : 'default';

  const handleClick = () => {
    if (!isAnswered) {
      onClick();
      setShowExplanation(true);
    } else {
      if (isPicked) {
        setShowExplanation(!showExplanation);
      } else {
        onClick();
        setShowExplanation(!showExplanation);
      }
    }
  };

  const shouldShowExplanation = isAnswered && showExplanation;

  return (
    <ChoiceContainer onClick={handleClick}>
      <ChoiceContent $state={state}>
        {!shouldShowExplanation ? (
          <>
            <Keycap>{'ABCD'[choiceIndex]}</Keycap>
            <ChoiceText>{choice}</ChoiceText>
          </>
        ) : (
          <ExplanationContent>
            <ExplainBadge $ok={isCorrect}>
              {isCorrect ? '정답' : '오답'}
            </ExplainBadge>
            {explanation ? explanation : '해설이 없습니다'}
          </ExplanationContent>
        )}
      </ChoiceContent>
    </ChoiceContainer>
  );
}

export function MultipleChoiceCard({ question, picked, onChoiceClick }: MultipleChoiceCardProps) {
  const isAnswered = picked !== undefined;

  return (
    <>
      <Choices>
        {question.choices.map((choice, i) => {
          const isThisCorrect = i === question.answer;
          const isThisPicked = i === picked;

          return (
            <ChoiceCard
              key={`${question.id}-${i}-${choice.slice(0,12)}`}
              choice={choice}
              choiceIndex={i}
              label={'ABCD'[i]}
              isAnswered={isAnswered}
              isCorrect={isThisCorrect}
              isPicked={isThisPicked}
              explanation={question.choiceExplanations?.[i]}
              onClick={() => onChoiceClick(i)}
            />
          );
        })}
      </Choices>

      {isAnswered && (
        <ClickHint>선택한 답을 클릭하여 해설을 확인하세요</ClickHint>
      )}
    </>
  );
}

/* Styled Components */

const Choices = styled.div`
  display: grid;
  gap: 12px;
`;

const ChoiceContainer = styled.div`
  cursor: pointer;
  min-height: 70px;
`;

const ChoiceContent = styled.div<{ $state: 'correct' | 'wrong' | 'default' }>`
  width: 100%;
  min-height: 70px;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #2e3a4d;
  background: #0d1322;
  color: #e8edf3;
  transition: border-color .12s ease, background .12s ease;

  &:hover {
    border-color: #435269;
  }

  ${({ $state }) => $state === 'correct' && css`
    border-color: #14532d;
    background: #0b2d19;
  `}
  ${({ $state }) => $state === 'wrong' && css`
    border-color: #7f1d1d;
    background: #2a0f0f;
  `}
`;

const ChoiceText = styled.span`
  flex: 1;
  line-height: 1.5;
`;

const ExplanationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  line-height: 1.5;
`;

const Keycap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  font-size: 13px;
  font-weight: 700;
  color: #dfe7ef;
  background: #1a2235;
  border: 1px solid #2f3e58;
  border-radius: 8px;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05);
  flex-shrink: 0;
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

const ClickHint = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
`;
