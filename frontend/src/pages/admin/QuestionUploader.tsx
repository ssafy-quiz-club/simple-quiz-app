import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { uploadQuestions, type UploadQuestionData } from '../../services/questionService';
import { getSubjects } from '../../services/subjectService';
import { getLectures } from '../../services/lectureService';
import type { Lecture, Subject } from '../../types';

type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE';

export function QuestionUploader() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE');
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsData, lecturesData] = await Promise.all([
          getSubjects(),
          getLectures()
        ]);
        setSubjects(subjectsData);
        setLectures(lecturesData);

        if (subjectsData.length > 0) {
          setSelectedSubjectId(subjectsData[0].id);
        }
      } catch (error) {
        setMessage({ type: 'error', text: '데이터를 불러오는 데 실패했습니다.' });
      }
    };
    fetchData();
  }, []);

  // 과목에 따른 강의 필터링
  const filteredLectures = useMemo(() => {
    if (selectedSubjectId == null) return [];
    return lectures.filter(l => l.subjectId === selectedSubjectId);
  }, [lectures, selectedSubjectId]);

  // 선택한 과목의 첫 번째 강의를 자동 선택
  useEffect(() => {
    if (filteredLectures.length > 0) {
      setSelectedLectureId(filteredLectures[0].id);
    } else {
      setSelectedLectureId(null);
    }
  }, [filteredLectures]);

  const exampleJsonMap = {
    MULTIPLE_CHOICE: {
      "questions": [
        {
          "content": "다음 중 Python의 특징이 아닌 것은?",
          "questionType": "MULTIPLE_CHOICE",
          "choices": [
            { "content": "동적 타입 언어", "isCorrect": false, "explanation": "Python은 동적 타입 언어입니다." },
            { "content": "컴파일 언어", "isCorrect": true, "explanation": "Python은 인터프리터 언어입니다." },
            { "content": "객체지향 언어", "isCorrect": false, "explanation": "Python은 객체지향을 지원합니다." },
            { "content": "고수준 언어", "isCorrect": false, "explanation": "Python은 고수준 언어입니다." }
          ]
        }
      ]
    },
    SHORT_ANSWER: {
      "questions": [
        {
          "content": "2024 + 1은?",
          "questionType": "SHORT_ANSWER",
          "choices": [
            { "content": "2025", "isCorrect": true, "explanation": "2024 + 1 = 2025입니다." }
          ]
        }
      ]
    },
    TRUE_FALSE: {
      "questions": [
        {
          "content": "서울은 대한민국의 수도이다",
          "questionType": "TRUE_FALSE",
          "choices": [
            { "content": "O", "isCorrect": true, "explanation": "서울은 1394년부터 대한민국의 수도입니다." },
            { "content": "X", "isCorrect": false, "explanation": null }
          ]
        }
      ]
    }
  };

  const exampleJson = exampleJsonMap[questionType];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!selectedLectureId) {
      setMessage({ type: 'error', text: '강의를 선택해주세요.' });
      return;
    }

    if (!jsonText.trim()) {
      setMessage({ type: 'error', text: 'JSON 데이터를 입력해주세요.' });
      return;
    }

    try {
      setUploading(true);
      setMessage(null);

      const parsed = JSON.parse(jsonText);
      const uploadData: UploadQuestionData = {
        lectureId: selectedLectureId,
        questions: parsed.questions,
      };

      await uploadQuestions(uploadData);
      setMessage({ type: 'success', text: '문제가 성공적으로 업로드되었습니다!' });
      setJsonText(''); // 성공 시 텍스트 초기화
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        setMessage({ type: 'error', text: 'JSON 형식이 올바르지 않습니다.' });
      } else {
        setMessage({ type: 'error', text: error?.response?.data || error?.message || '업로드 실패' });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageContainer>
      <h1>문제 추가 (JSON)</h1>
      
      <UploaderGrid>
        <InputSection>
          <Section>
            <Label>1. 과목 선택</Label>
            <Select
              value={selectedSubjectId ?? ''}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </Select>
          </Section>

          <Section>
            <Label>2. 강의 선택</Label>
            <Select
              value={selectedLectureId ?? ''}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
              disabled={filteredLectures.length === 0}
            >
              {filteredLectures.length === 0 ? (
                <option value="">이 과목에는 강의가 없습니다</option>
              ) : (
                filteredLectures.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.name}
                  </option>
                ))
              )}
            </Select>
          </Section>

          <Section>
            <Label>3. 문제 유형 선택</Label>
            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
            >
              <option value="MULTIPLE_CHOICE">객관식 (Multiple Choice)</option>
              <option value="SHORT_ANSWER">주관식 (Short Answer)</option>
              <option value="TRUE_FALSE">OX 문제 (True/False)</option>
            </Select>
          </Section>

          <Section>
            <Label>4. JSON 파일 업로드</Label>
            <FileInput type="file" accept=".json" onChange={handleFileUpload} />
          </Section>

          <Section>
            <Label>5. JSON 데이터 직접 입력</Label>
            <TextArea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={JSON.stringify(exampleJson, null, 2)}
              rows={15}
            />
          </Section>
        </InputSection>

        <ExampleSection>
          <ExampleBox>
            <strong>JSON 형식 예시:</strong>
            <pre>{JSON.stringify(exampleJson, null, 2)}</pre>
            <ul>
              <li>`questionType`: 문제 유형 (MULTIPLE_CHOICE, SHORT_ANSWER, TRUE_FALSE)</li>
              <li>`questions` 배열에 여러 문제를 추가할 수 있습니다.</li>
              <li>객관식: 4개의 보기 추가, 정답에 `isCorrect: true`</li>
              <li>주관식: 1개의 정답 보기만 추가</li>
              <li>OX: O와 X 두 개의 보기, 정답에 `isCorrect: true`</li>
              <li>정답 보기의 `explanation`에만 해설 작성 (다른 보기는 null)</li>
            </ul>
          </ExampleBox>
        </ExampleSection>
      </UploaderGrid>

      {message && (
        <Message $type={message.type}>
          {message.text}
        </Message>
      )}

      <BtnUpload onClick={handleUpload} disabled={uploading}>
        {uploading ? '업로드 중...' : '업로드'}
      </BtnUpload>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UploaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const InputSection = styled.div``;
const ExampleSection = styled.div``;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2a6df3;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 10px;
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 14px;

  &::file-selector-button {
    padding: 6px 12px;
    background: #2a6df3;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background: #2057c9;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2a6df3;
  }
`;

const ExampleBox = styled.div`
  background: #111827;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 24px;
  height: 100%;

  strong {
    color: #cbd5e1;
    display: block;
    margin-bottom: 8px;
  }

  pre {
    background: #0d1117;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    color: #22c55e;
    margin: 8px 0;
  }

  ul {
    margin: 12px 0 0 20px;
    color: #9ca3af;
    font-size: 13px;

    li {
      margin-bottom: 4px;
    }
  }
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  background: ${({ $type }) => ($type === 'success' ? '#0b2d19' : '#2a0f0f')};
  border: 1px solid ${({ $type }) => ($type === 'success' ? '#14532d' : '#7f1d1d')};
  color: ${({ $type }) => ($type === 'success' ? '#b6ffd2' : '#ffbaba')};
`;

const BtnUpload = styled.button`
  padding: 12px 24px;
  background: linear-gradient(180deg, #2a6df3, #2057c9);
  color: white;
  border: 1px solid #1f4fb8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  align-self: flex-start;

  &:hover {
    background: linear-gradient(180deg, #2057c9, #1a4aab);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
