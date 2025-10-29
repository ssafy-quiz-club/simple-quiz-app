import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminAuth } from '../services/adminService';
import { AdminLayout } from './admin/AdminLayout';
import { LectureManager } from './admin/LectureManager';
import { QuestionManager } from './admin/QuestionManager';
import { QuestionUploader } from './admin/QuestionUploader';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError('');
    const success = await adminAuth(password);
    setAuthenticating(false);

    if (success) {
      setIsAuthenticated(true);
      setSecret(password);
    } else {
      setAuthError('비밀번호가 일치하지 않습니다.');
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPageContainer>
        <LoginCard>
          <h1>관리자 로그인</h1>
          <form onSubmit={handleLogin}>
            <Input
              type="password"
              placeholder="관리자 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authenticating}
            />
            {authError && <ErrorText>{authError}</ErrorText>}
            <Button type="submit" disabled={authenticating}>
              {authenticating ? '인증 중...' : '로그인'}
            </Button>
          </form>
        </LoginCard>
      </LoginPageContainer>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="lectures" replace />} />
        <Route path="lectures" element={<LectureManager secret={secret} />} />
        <Route path="questions" element={<QuestionManager secret={secret} />} />
        <Route path="upload" element={<QuestionUploader />} />
      </Route>
    </Routes>
  );
}

export default AdminPage;

// Styled Components for Login Page
const LoginPageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1117;
`;

const LoginCard = styled.div`
  max-width: 400px;
  width: 100%;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  h1 {
    margin: 0 0 24px;
    font-size: 24px;
    text-align: center;
    color: #e5e7eb;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  background: #0d1117;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #2a6df3;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  color: white;
  border: 1px solid #1f4fb8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: linear-gradient(180deg, #2057c9, #1a4aab);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
`;