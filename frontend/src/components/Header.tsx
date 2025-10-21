import styled from 'styled-components';
import { pingServer } from '../services/quizService';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  onReset: () => void;
  onShuffle: () => void;
}

export function Header({ title, currentIndex, totalQuestions, score, onReset, onShuffle }: HeaderProps) {
  const [pingStatus, setPingStatus] = useState<string>('');

  const handlePing = async () => {
    setPingStatus('테스트 중...');
    try {
      const response = await pingServer();
      setPingStatus(`✅ ${response}`);
      console.log('Ping 성공:', response);
      setTimeout(() => setPingStatus(''), 3000);
    } catch (error) {
      setPingStatus('❌ 실패');
      console.error('Ping 실패:', error);
      setTimeout(() => setPingStatus(''), 3000);
    }
  };

  return (
    <Wrap>
      <Left>
        <Title>{title}</Title>
        <Sub>JSON 파일을 직접 import하여 렌더링합니다.</Sub>
      </Left>
      <Right>
        <Pill>{currentIndex + 1} / {totalQuestions}</Pill>
        <Pill>점수 {score}</Pill>
        <Btn onClick={handlePing}>
          서버 연결 테스트 {pingStatus && `(${pingStatus})`}
        </Btn>
        <Btn onClick={onReset}>초기화</Btn>
        <BtnPrimary onClick={onShuffle}>재섞기</BtnPrimary>
      </Right>
    </Wrap>
  );
}

/* ------------ styled ------------ */

const Wrap = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  flex-wrap: wrap;
`;

const Left = styled.div``;

const Right = styled.div`
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0 0 4px;
  font-size: 24px; line-height: 1.2; letter-spacing: -0.2px;
`;

const Sub = styled.div`
  color: #8fa0b3; font-size: 13px;
`;

const Pill = styled.span`
  border: 1px solid #2e3a4d; color: #a6b3c4;
  border-radius: 999px; padding: 6px 10px; font-size: 12px;
  background: rgba(255,255,255,0.02);
`;

const Btn = styled.button`
  padding: 10px 12px; border-radius: 12px;
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
