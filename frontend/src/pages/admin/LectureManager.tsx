import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addLectureAdmin, deleteLectureAdmin } from '../../services/adminService';
import { getLectures } from '../../services/lectureService';
import { getSubjects } from '../../services/subjectService';
import type { Lecture, Subject } from '../../types';

interface Props {
  secret: string;
}

export function LectureManager({ secret }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [newLectureName, setNewLectureName] = useState('1-1 ');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
    loadLectures();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubjectId(data[0].id);
      }
    } catch (err) {
      setError('과목 목록을 불러오지 못했습니다.');
    }
  };

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
    if (!selectedSubjectId) {
      alert('과목을 선택하세요.');
      return;
    }

    // 강의 이름 형식 검증 (숫자-숫자 강의명)
    const namePattern = /^\d+-\d+\s+.+/;
    if (!namePattern.test(newLectureName)) {
      alert('강의 이름은 "숫자-숫자 강의명" 형식이어야 합니다.\n예: 1-1 머신러닝 기초');
      return;
    }

    try {
      await addLectureAdmin(newLectureName, selectedSubjectId, secret);
      setNewLectureName('1-1 '); // 초기화 시 기본값으로 복구
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
        <Select
          value={selectedSubjectId ?? ''}
          onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
        >
          <option value="" disabled>과목 선택</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="예: 1-1 머신러닝 기초"
          value={newLectureName}
          onChange={(e) => setNewLectureName(e.target.value)}
        />
        <Button type="submit">강의 추가</Button>
      </Form>

      {error && <ErrorText>{error}</ErrorText>}

      <LectureList>
        {lectures
          .filter(lec => selectedSubjectId === null || lec.subjectId === selectedSubjectId)
          .map(lec => (
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
  max-width: 700px;
`;

const Select = styled.select`
  padding: 12px 16px;
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 16px;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #2a6df3;
  }
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
