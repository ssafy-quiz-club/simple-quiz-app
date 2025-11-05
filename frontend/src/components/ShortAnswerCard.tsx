import { useState } from 'react';
import styled from 'styled-components';
import type { Question } from '../types';

interface ShortAnswerCardProps {
  question: Question;
  picked: number | undefined;
  onChoiceClick: (choiceIndex: number) => void;
}

export function ShortAnswerCard({ question, picked, onChoiceClick }: ShortAnswerCardProps) {
  const [answer, setAnswer] = useState('');
  const isAnswered = picked !== undefined;
  const isCorrect = isAnswered && picked === question.answer;
  const correctAnswer = question.choices[question.answer] || '';

  const handleSubmit = () => {
    if (!answer.trim()) return;

    // 정답 비교 (대소문자 무시, 공백 제거)
    const userAnswer = answer.trim().toLowerCase();
    const correct = correctAnswer.trim().toLowerCase();
    const isMatch = userAnswer === correct;

    // 맞으면 정답 인덱스, 틀리면 -1
    onChoiceClick(isMatch ? question.answer : -1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnswered && answer.trim()) {
      handleSubmit();
    }
  };

  return (
    <>
      <ShortAnswerContainer>
        <ShortAnswerInput
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="답을 입력하세요"
          disabled={isAnswered}
          autoFocus
        />
        {!isAnswered && (
          <SubmitButton onClick={handleSubmit} disabled={!answer.trim()}>
            제출
          </SubmitButton>
        )}
      </ShortAnswerContainer>

      {isAnswered && (
        <ResultBox>
          <ResultRow>
            <ExplainBadge $ok={isCorrect}>
              {isCorrect ? '정답' : '오답'}
            </ExplainBadge>
            <ResultContent>
              <ResultItem>
                <Label>입력한 답:</Label>
                <Value $correct={isCorrect}>{answer}</Value>
              </ResultItem>
              {!isCorrect && (
                <ResultItem>
                  <Label>정답:</Label>
                  <Value $correct={true}>{correctAnswer}</Value>
                </ResultItem>
              )}
            </ResultContent>
          </ResultRow>

          {question.explanation && (
            <ExplanationSection>
              <ExplanationLabel>해설</ExplanationLabel>
              <ExplanationText>{question.explanation}</ExplanationText>
            </ExplanationSection>
          )}
        </ResultBox>
      )}
    </>
  );
}

/* Styled Components */

const ShortAnswerContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 20px 0;
`;

const ShortAnswerInput = styled.input`
  flex: 1;
  padding: 16px 18px;
  font-size: 16px;
  border-radius: 12px;
  border: 1px solid #2e3a4d;
  background: #0d1322;
  color: #e8edf3;
  outline: none;
  transition: border-color .12s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus:not(:disabled) {
    border-color: #2a6df3;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid #1f4fb8;
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .12s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(42, 109, 243, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: #0d1322;
  border: 1px solid #2e3a4d;
`;

const ResultRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
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

const ResultContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #94a3b8;
`;

const Value = styled.strong<{ $correct: boolean }>`
  font-size: 16px;
  color: ${({ $correct }) => ($correct ? '#22c55e' : '#ef4444')};
`;

const ExplanationSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #1e293b;
`;

const ExplanationLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
`;

const ExplanationText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #e8edf3;
`;
