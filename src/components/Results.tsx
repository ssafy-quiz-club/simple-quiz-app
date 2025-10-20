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
    <div className="review">
      <div style={{ fontSize: '18px' }}>
        🎉 결과: <strong>{score}/{totalQuestions}</strong> ({Math.round((score / totalQuestions) * 100)}%)
      </div>
      
      {incorrectAnswers.length > 0 ? (
        <>
          <div className="muted" style={{ marginTop: '10px' }}>오답은 아래와 같습니다.</div>
          {incorrectAnswers.map(({ q, i }) => {
            const sel = picks[q.id];
            const your = `(${ "ABCD"[sel] }) ${q.choices[sel]}`;
            const corr = `(${ "ABCD"[q.answer] }) ${q.choices[q.answer]}`;
            const exp = q.explanation ? `<div class="muted">해설: ${q.explanation}</div>` : "";

            return (
              <div style={{ margin: '10px 0' }} key={q.id}>
                <div><strong>{i + 1}. {q.question}</strong></div>
                <div className="muted">내 선택: {your}</div>
                <div>정답: {corr}</div>
                <div dangerouslySetInnerHTML={{ __html: exp }} />
              </div>
            );
          })}
        </>
      ) : (
        <div className="muted" style={{ marginTop: '10px' }}>🎉 오답이 없습니다. 완벽해요!</div>
      )}
    </div>
  );
}
