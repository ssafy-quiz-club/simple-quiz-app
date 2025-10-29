import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addLectureAdmin, deleteLectureAdmin } from '../../services/adminService';
import { getLectures } from '../../services/lectureService';
import type { Lecture } from '../../types';

interface Props {
  secret: string;
}

export function LectureManager({ secret }: Props) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [newLectureName, setNewLectureName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      const data = await getLectures();
      setLectures(data);
    } catch (err) {
      setError('강의 목록을 불러오지 못했습니다.');
    }
  };

  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLectureName.trim()) {
      alert('강의 이름을 입력하세요.');
      return;
    }
    try {
      await addLectureAdmin(newLectureName, secret);
      setNewLectureName('');
      await loadLectures();
      alert('강의가 추가되었습니다.');
    } catch (err: any) {
      alert('강의 추가 실패: ' + (err?.response?.data || err?.message));
    }
  };

  const handleDeleteLecture = async (lectureId: number) => {
    if (!confirm('정말 삭제하시겠습니까? 이 강의에 속한 문제가 없어야 삭제 가능합니다.')) return;
    try {
      await deleteLectureAdmin(lectureId, secret);
      await loadLectures();
      alert('삭제되었습니다.');
    } catch (err: any) {
      alert('삭제 실패: ' + (err?.response?.data?.body || err?.message));
    }
  };

  return (
    <PageContainer>
      <h1>강의 관리</h1>
      <Form onSubmit={handleAddLecture}>
        <Input
          type="text"
          placeholder="새 강의 이름"
          value={newLectureName}
          onChange={(e) => setNewLectureName(e.target.value)}
        />
        <Button type="submit">강의 추가</Button>
      </Form>

      {error && <ErrorText>{error}</ErrorText>}

      <LectureList>
        {lectures.map(lec => (
          <LectureItem key={lec.id}>
            <span>{lec.name} (ID: {lec.id})</span>
            <DeleteBtn onClick={() => handleDeleteLecture(lec.id)}>삭제</DeleteBtn>
          </LectureItem>
        ))}
      </LectureList>
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

const LectureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LectureItem = styled.div`
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
