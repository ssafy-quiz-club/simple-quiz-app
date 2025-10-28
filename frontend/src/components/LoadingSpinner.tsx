import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = '로딩 중...' }: LoadingSpinnerProps) {
  return (
    <Container>
      <Spinner />
      <Message>{message}</Message>
    </Container>
  );
}

/* Animations */
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

/* Styled Components */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 60px 20px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(42, 109, 243, 0.2);
  border-top-color: #2a6df3;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
  color: #cbd5e1;
  font-size: 16px;
  margin: 0;
`;
