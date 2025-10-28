import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminAuth, getAllQuestionsAdmin, deleteQuestionAdmin } from '../services/adminService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ApiQuestionDto } from '../types';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const [questions, setQuestions] = useState<ApiQuestionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError('');

    const success = await adminAuth(password);
    setAuthenticating(false);

    if (success) {
      setIsAuthenticated(true);
      setSecret(password);
      loadQuestions(password);
    } else {
      setAuthError('비밀번호가 일치하지 않습니다.');
    }
  };

  const loadQuestions = async (adminSecret: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllQuestionsAdmin(adminSecret);
      setQuestions(data);
    } catch (err: any) {
      setError(err?.message || '문제 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteQuestionAdmin(questionId, secret);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      alert('삭제되었습니다.');
    } catch (err: any) {
      alert('삭제 실패: ' + (err?.response?.data || err?.message));
    }
  };

  const lectures = Array.from(new Set(questions.map(q => q.id))).map(id => {
    const q = questions.find(x => x.id === id);
    return { id: id, name: `강의 ${id}` };
  });

  const filteredQuestions = selectedLecture
    ? questions.filter(q => q.id === selectedLecture)
    : questions;

  if (!isAuthenticated) {
    return (
      <Page>
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
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <h1>문제 관리</h1>
        <Button onClick={() => loadQuestions(secret)}>새로고침</Button>
      </Header>

      {loading && <LoadingSpinner message="문제 목록을 불러오는 중..." />}
      {error && <ErrorText>{error}</ErrorText>}

      {!loading && (
        <>
          <FilterBar>
            <label>강의 필터:</label>
            <select
              value={selectedLecture ?? ''}
              onChange={(e) => setSelectedLecture(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">전체</option>
              {lectures.map(lec => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
            </select>
            <Info>총 {filteredQuestions.length}개 문제</Info>
          </FilterBar>

          <QuestionList>
            {filteredQuestions.map((q) => (
              <QuestionItem key={q.id}>
                <QuestionHeader>
                  <QuestionId>문제 #{q.id}</QuestionId>
                  <DeleteBtn onClick={() => handleDelete(q.id)}>삭제</DeleteBtn>
                </QuestionHeader>
                <QuestionContent>{q.content}</QuestionContent>
                <ChoiceList>
                  {q.answers?.map((ans, idx) => (
                    <Choice key={ans.id} $correct={ans.correct}>
                      {idx + 1}. {ans.content} {ans.correct && '✓'}
                    </Choice>
                  ))}
                </ChoiceList>
                {q.explanations && q.explanations.length > 0 && (
                  <Explanation>
                    <strong>해설:</strong> {q.explanations[0].content}
                  </Explanation>
                )}
              </QuestionItem>
            ))}
          </QuestionList>
        </>
      )}
    </Page>
  );
}

export default AdminPage;

/* Styled Components */

const Page = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
`;

const LoginCard = styled.div`
  max-width: 400px;
  margin: 100px auto;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);

  h1 {
    margin: 0 0 24px;
    font-size: 24px;
    text-align: center;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 28px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 12px;

  label {
    font-size: 14px;
    color: #cbd5e1;
  }

  select {
    padding: 8px 12px;
    background: #0d1117;
    color: #e5e7eb;
    border: 1px solid #334155;
    border-radius: 8px;
    font-size: 14px;
  }
`;

const Info = styled.span`
  margin-left: auto;
  color: #9ca3af;
  font-size: 14px;
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuestionItem = styled.div`
  background: #111827;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const QuestionId = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2a6df3;
`;

const DeleteBtn = styled.button`
  padding: 6px 12px;
  background: #7f1d1d;
  color: #ffbaba;
  border: 1px solid #991b1b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: #991b1b;
  }
`;

const QuestionContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #e5e7eb;
`;

const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

const Choice = styled.div<{ $correct?: boolean }>`
  padding: 10px 12px;
  background: ${({ $correct }) => ($correct ? '#0b2d19' : '#0d1117')};
  border: 1px solid ${({ $correct }) => ($correct ? '#14532d' : '#334155')};
  color: ${({ $correct }) => ($correct ? '#b6ffd2' : '#cbd5e1')};
  border-radius: 8px;
  font-size: 14px;
`;

const Explanation = styled.div`
  padding: 12px;
  background: #0d1117;
  border-left: 3px solid #2a6df3;
  border-radius: 6px;
  font-size: 14px;
  color: #9ca3af;

  strong {
    color: #cbd5e1;
  }
`;
