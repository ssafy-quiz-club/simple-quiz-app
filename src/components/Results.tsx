import styled from 'styled-components';
import type { Question } from '../types';

interface ResultsProps {
  score: number;
  totalQuestions: number;
  order: number[];
  questions: Question[];
  picks: Record<string, number>;
}

export function Results({ score, totalQuestions, order, questions, picks }: ResultsProps) {
  const incorrectAnswers = order
    .map((qIdx, i) => ({ q: questions[qIdx], i }))
    .filter(({ q }) => picks[q.id] !== undefined && picks[q.id] !== q.answer);

  return (
    <Wrap>
      <Headline>
        🎉 결과: <strong>{score}/{totalQuestions}</strong>
        <Pct>({Math.round((score / totalQuestions) * 100)}%)</Pct>
      </Headline>

      {incorrectAnswers.length > 0 ? (
        <>
          <Muted>오답은 아래와 같습니다.</Muted>
          <List>
            {incorrectAnswers.map(({ q, i }) => {
              const sel = picks[q.id]!;
              const your = `(${ 'ABCD'[sel] }) ${q.choices[sel]}`;
              const corr = `(${ 'ABCD'[q.answer] }) ${q.choices[q.answer]}`;
              const exp = q.explanation ? `<div>해설: ${q.explanation}</div>` : '';

              return (
                <Item key={q.id}>
                  <Q><b>{i + 1}. {q.question}</b></Q>
                  <Mine>내 선택: {your}</Mine>
                  <Corr>정답: {corr}</Corr>
                  <Explanation dangerouslySetInnerHTML={{ __html: exp }} />
                </Item>
              );
            })}
          </List>
        </>
      ) : (
        <Muted>🎉 오답이 없습니다. 완벽해요!</Muted>
      )}
    </Wrap>
  );
}

/* ------------ styled ------------ */

const Wrap = styled.div`
  margin-top: 14px; padding-top: 14px;
  border-top: 1px dashed #2e3a4d;
`;

const Headline = styled.div`
  font-size: 18px; display: flex; align-items: baseline; gap: 8px;
`;

const Pct = styled.span`
  color: #9fb5ff; font-weight: 600;
`;

const Muted = styled.div`
  color: #8fa0b3; margin-top: 10px;
`;

const List = styled.div`
  display: grid; gap: 12px; margin-top: 10px;
`;

const Item = styled.div`
  background: #0d1322; border: 1px solid #2e3a4d; border-radius: 12px;
  padding: 12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,.25);
`;

const Q = styled.div`
  margin-bottom: 6px; line-height: 1.5;
`;

const Mine = styled.div`
  color: #8fa0b3; font-size: 14px; margin-bottom: 2px;
`;

const Corr = styled.div`
  color: #e6ffef; font-size: 14px; margin-bottom: 6px;
`;

const Explanation = styled.div`
  color: #cfd8e3; font-size: 14px;

  /* 오타/임의 HTML이 들어올 수 있으니 기본 스타일만 */
  div { color: #a9b6c8; }
`;
