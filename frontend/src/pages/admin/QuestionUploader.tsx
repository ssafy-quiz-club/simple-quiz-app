import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { uploadQuestions, type UploadQuestionData } from '../../services/questionService';
import { getLectures } from '../../services/lectureService';
import type { Lecture } from '../../types';

export function QuestionUploader() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
        if (data.length > 0) {
          setSelectedLectureId(data[0].id);
        }
      } catch (error) {
        setMessage({ type: 'error', text: '강의 목록을 불러오는 데 실패했습니다.' });
      }
    };
    fetchLectures();
  }, []);

  const exampleJson = {
    "questions": [
      {
        "content": "문제 내용을 입력하세요",
        "choices": [
          { "content": "보기1", "isCorrect": false, "explanation": "보기1 해설" },
          { "content": "보기2", "isCorrect": false, "explanation": "보기2 해설" },
          { "content": "보기3", "isCorrect": true, "explanation": "보기3 해설 (정답)" },
          { "content": "보기4", "isCorrect": false, "explanation": "보기4 해설" }
        ]
      }
    ]
  };

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
            <Label>1. 강의 선택</Label>
            <Select
              value={selectedLectureId ?? ''}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
            >
              {lectures.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
            </Select>
          </Section>

          <Section>
            <Label>2. JSON 파일 업로드</Label>
            <FileInput type="file" accept=".json" onChange={handleFileUpload} />
          </Section>

          <Section>
            <Label>3. JSON 데이터 직접 입력</Label>
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
              <li>`questions` 배열에 여러 문제를 추가할 수 있습니다.</li>
              <li>각 보기(choice)마다 개별 해설(explanation)을 작성할 수 있습니다.</li>
              <li>`isCorrect`를 true로 설정하여 정답을 지정합니다.</li>
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
