import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addSubjectAdmin, deleteSubjectAdmin } from '../../services/adminService';
import { getSubjects } from '../../services/subjectService';
import type { Subject } from '../../types';

interface Props {
  secret: string;
}

export function SubjectManager({ secret }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      setError('과목 목록을 불러오지 못했습니다.');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      alert('과목 이름을 입력하세요.');
      return;
    }
    try {
      await addSubjectAdmin(newSubjectName, secret);
      setNewSubjectName('');
      await loadSubjects();
      alert('과목이 추가되었습니다.');
    } catch (err: any) {
      alert('과목 추가 실패: ' + (err?.response?.data || err?.message));
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (!confirm('정말 삭제하시겠습니까? 이 과목에 속한 강의가 없어야 삭제 가능합니다.')) return;
    try {
      await deleteSubjectAdmin(subjectId, secret);
      await loadSubjects();
      alert('삭제되었습니다.');
    } catch (err: any) {
      alert('삭제 실패: ' + (err?.response?.data || err?.message));
    }
  };

  return (
    <PageContainer>
      <h1>과목 관리</h1>
      <Form onSubmit={handleAddSubject}>
        <Input
          type="text"
          placeholder="새 과목 이름"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
        />
        <Button type="submit">과목 추가</Button>
      </Form>

      {error && <ErrorText>{error}</ErrorText>}

      <SubjectList>
        {subjects.map(subject => (
          <SubjectItem key={subject.id}>
            <span>{subject.name} (ID: {subject.id})</span>
            <DeleteBtn onClick={() => handleDeleteSubject(subject.id)}>삭제</DeleteBtn>
          </SubjectItem>
        ))}
      </SubjectList>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
  max-width: 500px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  background: #1f2937;
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
  white-space: nowrap;

  &:hover {
    background: linear-gradient(180deg, #2057c9, #1a4aab);
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 14px;
`;

const SubjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SubjectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 8px;

  span {
    color: #cbd5e1;
    font-weight: 500;
  }
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
