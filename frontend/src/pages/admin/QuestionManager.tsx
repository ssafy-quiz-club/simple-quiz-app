import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllQuestionsAdmin, deleteQuestionAdmin } from '../../services/adminService';
import { getLectures } from '../../services/lectureService';
import { getSubjects } from '../../services/subjectService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import type { ApiQuestionDto, Lecture, Subject } from '../../types';

interface Props {
  secret: string;
}

export function QuestionManager({ secret }: Props) {
  const [questions, setQuestions] = useState<ApiQuestionDto[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [secret]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [questionsData, lecturesData, subjectsData] = await Promise.all([
        getAllQuestionsAdmin(secret),
        getLectures(),
        getSubjects(),
      ]);
      setQuestions(questionsData);
      setLectures(lecturesData);
      setSubjects(subjectsData);
    } catch (err: any) {
      setError(err?.message || '데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteQuestionAdmin(questionId, secret);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      alert('삭제되었습니다.');
    } catch (err: any) {
      alert('삭제 실패: ' + (err?.response?.data || err?.message));
    }
  };

  // 과목별 강의 필터링
  const filteredLectures = selectedSubject
    ? lectures.filter(lec => lec.subjectId === selectedSubject)
    : lectures;

  // 강의 또는 과목별 문제 필터링
  const filteredQuestions = questions.filter(q => {
    if (selectedLecture) {
      return q.lecture.id === selectedLecture;
    }
    if (selectedSubject) {
      return filteredLectures.some(lec => lec.id === q.lecture.id);
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="문제 목록을 불러오는 중..." />;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <PageContainer>
      <h1>문제 목록</h1>
      <FilterBar>
        <label>과목 필터:</label>
        <select
          value={selectedSubject ?? ''}
          onChange={(e) => {
            setSelectedSubject(e.target.value ? Number(e.target.value) : null);
            setSelectedLecture(null); // 과목 변경 시 강의 선택 초기화
          }}
        >
          <option value="">전체</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <label>강의 필터:</label>
        <select
          value={selectedLecture ?? ''}
          onChange={(e) => setSelectedLecture(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">전체</option>
          {filteredLectures.map(lec => (
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
              <QuestionId>문제 #{q.id} (강의: {q.lecture.name})</QuestionId>
              <DeleteBtn onClick={() => handleDeleteQuestion(q.id)}>삭제</DeleteBtn>
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
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
    background: #1f2937;
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
  max-height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 8px;
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
  color: #9ca3af;
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
  background: #1f2937;
  border-left: 3px solid #2a6df3;
  border-radius: 6px;
  font-size: 14px;
  color: #9ca3af;

  strong {
    color: #cbd5e1;
  }
`;
