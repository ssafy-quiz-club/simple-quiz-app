import type { Question } from '../types';

interface NavigatorProps {
  order: number[];
  questions: Question[];
  picks: Record<string, number>;
  currentIndex: number;
  onNavClick: (index: number) => void;
}

export function Navigator({ order, questions, picks, currentIndex, onNavClick }: NavigatorProps) {
  return (
    <div className="nav-wrap" aria-label="문항 네비게이터" title="번호를 눌러 원하는 문항으로 이동">
      <div className="nav-title">문항</div>
      <div className="nav-grid">
        {order.map((qIdx, i) => {
          const q = questions[qIdx];
          const sel = picks[q.id];
          const isOk = sel !== undefined ? sel === q.answer : null;
          
          let btnClass = "nav-btn";
          if (i === currentIndex) btnClass += " current";
          if (sel !== undefined) btnClass += " answered";
          if (isOk === true) btnClass += " ok";
          else if (isOk === false) btnClass += " ng";
          
          return (
            <button key={i} className={btnClass} onClick={() => onNavClick(i)}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
