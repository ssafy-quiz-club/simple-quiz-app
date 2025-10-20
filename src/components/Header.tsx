interface HeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  onReset: () => void;
  onShuffle: () => void;
}

export function Header({ title, currentIndex, totalQuestions, score, onReset, onShuffle }: HeaderProps) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <div>
        <h1>{title}</h1>
        <div className="muted">JSON 파일을 직접 import하여 렌더링합니다.</div>
      </div>
      <div className="row">
        <span className="pill">{currentIndex + 1} / {totalQuestions}</span>
        <span className="pill">점수 {score}</span>
        <button className="btn" onClick={onReset}>초기화</button>
        <button className="btn" onClick={onShuffle}>재섞기</button>
      </div>
    </div>
  );
}
