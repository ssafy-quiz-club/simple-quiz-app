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
  question, 
  currentIndex, 
  totalQuestions, 
  picked, 
  onChoiceClick, 
  onPrev, 
  onNext 
}: QuestionCardProps) {
  return (
    <>
      <div className="progress">
        <div className="bar" style={{ width: `${(currentIndex / (totalQuestions - 1)) * 100}%` }}></div>
      </div>

      <div className="q">{question.question}</div>
      
      <div className="choices">
        {question.choices.map((choice, i) => {
          const isCorrect = i === question.answer;
          const isPicked = i === picked;
          let btnClass = "btn";
          if (picked !== undefined) {
            if (isCorrect) btnClass += " correct";
            else if (isPicked) btnClass += " wrong";
          }
          return (
            <button 
              key={i} 
              className={btnClass} 
              onClick={() => onChoiceClick(i)} 
              disabled={picked !== undefined}
            >
              {`ABCD`[i]}. {choice}
            </button>
          );
        })}
      </div>

      <div className="footer">
        <button className="btn" onClick={onPrev} disabled={currentIndex === 0}>이전</button>
        <button className="btn next" onClick={onNext} disabled={picked === undefined}>
          {currentIndex === totalQuestions - 1 ? "결과보기" : "다음"}
        </button>
      </div>
    </>
  );
}
