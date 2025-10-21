// src/components/Navigator.tsx
import styled, { css } from 'styled-components';
import type { Question } from '../types';

interface NavigatorProps {
  order: number[];
  questions: Question[];
  picks: Record<string, number>;
  currentIndex: number;
  onNavClick: (index: number) => void;
  title?: string;
  className?: string; // 부모에서 styled로 감싸기 위함
}

export function Navigator({
  order, questions, picks, currentIndex, onNavClick, title = '문항 네비게이터', className
}: NavigatorProps) {
  return (
    <Wrap className={className} aria-label="문항 네비게이터">
      <Title>{title}</Title>
      <Grid role="list">
        {order.map((qIdx, i) => {
          const q = questions[qIdx];
          const sel = picks[q.id];
          const isOk = sel !== undefined ? sel === q.answer : null;

          return (
            <Btn
              key={i}
              role="listitem"
              aria-current={i === currentIndex ? 'true' : undefined}
              aria-label={`${i + 1}번${sel !== undefined ? (isOk ? ' (정답)' : ' (오답)') : ''}`}
              $current={i === currentIndex}
              $answered={sel !== undefined}
              $ok={isOk === true}
              $ng={isOk === false}
              onClick={() => onNavClick(i)}
            >
              {i + 1}
            </Btn>
          );
        })}
      </Grid>
    </Wrap>
  );
}

/* ----- styles (포지셔닝 책임 X) ----- */

const Wrap = styled.nav`
  background: #0e1527;
  border: 1px solid #2e3a4d;
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
`;

const Title = styled.div`
  font-size: 14px; color: #a7b4c6; font-weight: 600;
  margin-bottom: 12px; letter-spacing: .2px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
  gap: 10px;
`;

const Btn = styled.button<{
  $current?: boolean; $answered?: boolean; $ok?: boolean; $ng?: boolean;
}>`
  height: 44px; border-radius: 12px;
  border: 1px solid #2e3a4d; background: #101b33; color: #e8edf3;
  font-size: 14px; font-weight: 600; letter-spacing: .2px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .15s ease; box-shadow: 0 2px 8px rgba(0,0,0,.25);

  &:hover { border-color:#3f5271; background:#14213b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,.35); }
  &:active { transform: translateY(0); box-shadow: 0 3px 10px rgba(0,0,0,.3); }

  ${({ $answered }) => $answered && css` border-color:#475569; background:#16213b; `}
  ${({ $current })  => $current  && css` outline:2px solid #2a6df3; box-shadow: 0 0 0 3px rgba(42,109,243,.25), 0 2px 8px rgba(0,0,0,.25); background:#1a2547; `}
  ${({ $ok })       => $ok       && css` background:#0b2d19; border-color:#14532d; color:#b6ffd2; box-shadow: 0 2px 10px rgba(20,83,45,.35); `}
  ${({ $ng })       => $ng       && css` background:#2a0f0f; border-color:#7f1d1d; color:#ffbaba; box-shadow: 0 2px 10px rgba(127,29,29,.25); `}
`;

export default Navigator;
