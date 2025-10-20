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

export function QuestionCard({
  question, currentIndex, totalQuestions, picked,
  onChoiceClick, onPrev, onNext
}: QuestionCardProps) {
  const percent = (currentIndex / (totalQuestions - 1)) * 100;

  return (
    <>
      <Progress aria-label="진행도">
        <Bar style={{ width: `${percent}%` }} />
      </Progress>

      <Q>{question.question}</Q>

      <Choices>
        {question.choices.map((choice, i) => {
          const isCorrect = i === question.answer;
          const isPicked = i === picked;
          const state: 'correct' | 'wrong' | 'default' =
            picked !== undefined ? (isCorrect ? 'correct' : isPicked ? 'wrong' : 'default') : 'default';

          return (
            <ChoiceBtn
              key={i}
              $state={state}
              onClick={() => onChoiceClick(i)}
              disabled={picked !== undefined}
              aria-pressed={isPicked}
            >
              <Keycap>{'ABCD'[i]}</Keycap>
              <span>{choice}</span>
            </ChoiceBtn>
          );
        })}
      </Choices>

      <Footer>
        <Btn onClick={onPrev} disabled={currentIndex === 0}>이전</Btn>
        <BtnPrimary onClick={onNext} disabled={picked === undefined}>
          {currentIndex === totalQuestions - 1 ? '결과보기' : '다음'}
        </BtnPrimary>
      </Footer>
    </>
  );
}

/* ------------ styled ------------ */

const Progress = styled.div`
  height: 10px; border-radius: 999px; overflow: hidden;
  background: #0e1628; border: 1px solid #2b3a52;
  margin: 10px 0 14px; position: relative;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.35);
`;

const Bar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #2a6df3, #26c26a);
  box-shadow: 0 0 12px rgba(38,194,106,.35);
  transition: width .25s ease;
`;

const Q = styled.div`
  font-size: 19px; line-height: 1.55; margin: 12px 0 12px; letter-spacing: .1px;
`;

const Choices = styled.div`
  display: grid; gap: 10px;
`;

const ChoiceBtn = styled.button<{ $state: 'correct' | 'wrong' | 'default' }>`
  display: flex; align-items: center; gap: 10px; text-align: left;
  padding: 14px 16px; border-radius: 14px; cursor: pointer; width: 100%;
  border: 1px solid #2e3a4d; background: #0d1322; color: #e8edf3;
  transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);

  &:hover{ border-color:#435269; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  &:active{ transform: translateY(0); box-shadow: 0 3px 10px rgba(0,0,0,.3); }
  &:disabled{ cursor: default; opacity: .98; transform:none; box-shadow: 0 2px 8px rgba(0,0,0,.25); }

  ${({ $state }) => $state === 'correct' && css`
    border-color: #14532d;
    background: #0b2d19;
  `}
  ${({ $state }) => $state === 'wrong' && css`
    border-color: #7f1d1d;
    background: #2a0f0f;
  `}
`;

const Keycap = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 28px; height: 28px; font-size: 12px; font-weight: 700;
  color: #dfe7ef; background: #1a2235; border: 1px solid #2f3e58; border-radius: 8px;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05);
`;

const Footer = styled.div`
  display: flex; justify-content: space-between; margin-top: 14px;
`;

const Btn = styled.button`
  padding: 12px 14px; border-radius: 12px;
  border: 1px solid #2e3a4d; background: #0d1322; color: #e8edf3;
  cursor: pointer; transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);

  &:hover{ border-color:#435269; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  &:active{ transform: translateY(0); box-shadow: 0 3px 10px rgba(0,0,0,.3); }
  &:disabled{ opacity:.55; cursor:not-allowed; }
`;

const BtnPrimary = styled(Btn)`
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  border-color: #1f4fb8;
`;
