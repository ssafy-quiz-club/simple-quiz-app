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
  const [flipped, setFlipped] = useState(false);

  const state: 'correct' | 'wrong' | 'default' =
    isAnswered ? (isCorrect ? 'correct' : isPicked ? 'wrong' : 'default') : 'default';

  const handleClick = () => {
    if (!isAnswered) {
      onClick();
      // 답변 후 0.3초 뒤에 자동으로 카드 뒤집기
      setTimeout(() => setFlipped(true), 300);
    } else {
      // 이미 답변한 경우, 클릭하면 카드 토글
      setFlipped(!flipped);
    }
  };

  return (
    <ChoiceContainer onClick={handleClick}>
      <ChoiceInner $flipped={flipped && isAnswered} $state={state}>
        {/* 앞면: 선택지 */}
        <ChoiceFront $state={state}>
          <Keycap>{'ABCD'[choiceIndex]}</Keycap>
          <span>{choice}</span>
        </ChoiceFront>

        {/* 뒷면: 해설 */}
        <ChoiceBack $ok={isCorrect}>
          <ExplainBadge $ok={isCorrect}>
            {isCorrect ? '정답' : isPicked ? '오답' : ''}
          </ExplainBadge>
          {explanation && <BackText>{explanation}</BackText>}
          {!explanation && <BackText>해설이 없습니다</BackText>}
        </ChoiceBack>
      </ChoiceInner>
    </ChoiceContainer>
  );
}

export function QuestionCard({
  question, currentIndex, totalQuestions, picked,
  onChoiceClick, onPrev, onNext
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
        <ClickHint>보기를 클릭하여 해설을 확인하세요</ClickHint>
      )}

      <Footer>
        <Btn onClick={onPrev} disabled={currentIndex === 0}>이전</Btn>
        <BtnPrimary onClick={onNext} disabled={!isAnswered}>
          {currentIndex === totalQuestions - 1 ? '결과보기' : '다음'}
        </BtnPrimary>
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
  font-size: 19px;
  line-height: 1.55;
  margin: 12px 0 16px;
  letter-spacing: .1px;
  color: #e8edf3;
`;

const Choices = styled.div`
  display: grid;
  gap: 12px;
`;

// 플립 카드 컨테이너
const ChoiceContainer = styled.div`
  perspective: 1000px;
  cursor: pointer;
  min-height: 60px;
`;

const ChoiceInner = styled.div<{ $flipped: boolean; $state: 'correct' | 'wrong' | 'default' }>`
  position: relative;
  width: 100%;
  min-height: 60px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ $flipped }) => ($flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const ChoiceFace = styled.div`
  position: absolute;
  width: 100%;
  min-height: 60px;
  backface-visibility: hidden;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChoiceFront = styled(ChoiceFace)<{ $state: 'correct' | 'wrong' | 'default' }>`
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

const ChoiceBack = styled(ChoiceFace)<{ $ok: boolean }>`
  background: ${({ $ok }) => ($ok ? '#0b2d19' : '#2a0f0f')};
  border: 1px solid ${({ $ok }) => ($ok ? '#14532d' : '#7f1d1d')};
  color: #e8edf3;
  transform: rotateY(180deg);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
`;

const Keycap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  font-size: 12px;
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
  margin-bottom: 4px;
`;

const BackText = styled.p`
  margin: 0;
  line-height: 1.5;
  color: #e5e7eb;
  font-size: 14px;
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
  margin-top: 18px;
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

const BtnPrimary = styled(Btn)`
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  border-color: #1f4fb8;
`;
