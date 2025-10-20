import styled, { css } from 'styled-components';
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
    <NavWrap aria-label="문항 네비게이터" title="번호를 눌러 원하는 문항으로 이동">
      <NavTitle>문항 네비게이터</NavTitle>
      <NavGrid role="list">
        {order.map((qIdx, i) => {
          const q = questions[qIdx];
          const sel = picks[q.id];
          const isOk = sel !== undefined ? sel === q.answer : null;

          return (
            <NavBtn
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
            </NavBtn>
          );
        })}
      </NavGrid>
    </NavWrap>
  );
}

/* ------------ styled ------------ */

const NavWrap = styled.aside`
  position: fixed;
  right: 20px;
  top: 20px;
  width: 240px;                /* ✅ 폭 크게 변경 */
  background: #0e1527;
  border: 1px solid #2e3a4d;
  border-radius: 18px;
  padding: 16px 18px;
  z-index: 20;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);

  @media (max-width: 980px) {
    position: static;
    width: auto;
    margin: 12px 0;
    border-radius: 14px;
  }
`;

const NavTitle = styled.div`
  font-size: 14px;
  color: #a7b4c6;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
  padding-left: 4px;
  letter-spacing: 0.2px;
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));  /* ✅ 버튼 넓이 자동 조절 */
  gap: 10px;
`;

const NavBtn = styled.button<{
  $current?: boolean;
  $answered?: boolean;
  $ok?: boolean;
  $ng?: boolean;
}>`
  height: 44px;
  border-radius: 12px;
  border: 1px solid #2e3a4d;
  background: #101b33;
  color: #e8edf3;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #3f5271;
    background: #14213b;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  }

  ${({ $answered }) =>
    $answered &&
    css`
      border-color: #475569;
      background: #16213b;
    `}

  ${({ $current }) =>
    $current &&
    css`
      outline: 2px solid #2a6df3;
      box-shadow: 0 0 0 3px rgba(42, 109, 243, 0.25),
        0 2px 8px rgba(0, 0, 0, 0.25);
      background: #1a2547;
    `}

  ${({ $ok }) =>
    $ok &&
    css`
      background: #0b2d19;
      border-color: #14532d;
      color: #b6ffd2;
      box-shadow: 0 2px 10px rgba(20, 83, 45, 0.35);
    `}
  ${({ $ng }) =>
    $ng &&
    css`
      background: #2a0f0f;
      border-color: #7f1d1d;
      color: #ffbaba;
      box-shadow: 0 2px 10px rgba(127, 29, 29, 0.25);
    `}
`;

export default Navigator;
