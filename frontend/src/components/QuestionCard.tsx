import { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Question } from '../types';

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

  // 답변 전: default
  // 답변 후: 선택한 보기만 색상 표시 (정답=초록, 오답=빨강), 나머지는 default
  const state: 'correct' | 'wrong' | 'default' =
    isAnswered && isPicked ? (isCorrect ? 'correct' : 'wrong') : 'default';

  const handleClick = () => {
    if (!isAnswered) {
      // 첫 답변
      onClick();
      // 답변 직후 바로 해설 표시
      setShowExplanation(true);
    } else {
      // 이미 답변한 경우
      if (isPicked) {
        // 선택한 보기를 다시 클릭 → 해설 토글
        setShowExplanation(!showExplanation);
      } else {
        // 다른 보기를 클릭 → 답변 변경
        onClick();
        setShowExplanation(true);
      }
    }
  };

  // 선택한 보기이고 해설을 보여줄 때
  const shouldShowExplanation = isAnswered && isPicked && showExplanation;

  return (
    <ChoiceContainer onClick={handleClick}>
      <ChoiceContent $state={state}>
        {!shouldShowExplanation ? (
          // 선택지 표시
          <>
            <Keycap>{'ABCD'[choiceIndex]}</Keycap>
            <ChoiceText>{choice}</ChoiceText>
          </>
        ) : (
          // 해설 표시
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

export function QuestionCard({
  question, currentIndex, totalQuestions, picked,
  onChoiceClick, onPrev, onNext, onReset
}: QuestionCardProps) {
  const percent = (currentIndex / (totalQuestions - 1)) * 100;
  const isAnswered = picked !== undefined;
  const isCorrect = isAnswered && picked === question.answer;

  return (
    <>
      <Progress aria-label="진행도">
        <Bar style={{ width: `${percent}%` }} />
      </Progress>

      <Q>{question.question}</Q>

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

const Q = styled.div`
  font-size: 22px;
  line-height: 1.6;
  margin: 12px 0 20px;
  letter-spacing: .1px;
  color: #e8edf3;
  font-weight: 500;
`;

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
