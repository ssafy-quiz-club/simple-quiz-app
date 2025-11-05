export interface Question {
  id: string;
  type: string;
  question: string;
  questionType?: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE'; // 문제 유형
  choices: string[];
  answer: number;
  explanation?: string;
  choiceExplanations?: string[]; // 각 선택지별 해설
}

export interface QuizMeta {
  title: string;
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
}

export interface QuizData {
  meta: QuizMeta;
  questions: Question[];
}

// 백엔드 응답 DTO
export interface Subject {
  id: number;
  name: string;
}

export interface Lecture {
  id: number;
  name: string;
  subjectId?: number; // 과목 ID
}

export interface ApiAnswer {
  id: number;
  // 백엔드 필드명에 맞춰 주세요. (text 또는 content 중 하나일 가능성)
  content?: string;
  text?: string;
  correct?: boolean; // 정답 여부
  explanation?: string; // 각 보기별 해설
}

export interface ApiExplanation {
  id?: number;
  content?: string;
  text?: string;
}

export interface ApiQuestionDto {
  id: number;
  content: string;               // 문제 본문
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE'; // 문제 유형
  lecture: Lecture;              // 강의 정보
  answers: ApiAnswer[];          // 보기
  explanations?: ApiExplanation[]; // 해설(옵션)
}

// 프론트에서 쓰는 문제 타입(기존 컴포넌트 호환)
export interface UiQuestion {
  id: number | string;
  prompt: string;        // = content
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE'; // 문제 유형
  choices: string[];     // 보기 텍스트 배열
  answer: number;        // 정답 choice index
  explanation?: string;
  choiceExplanations?: string[]; // 각 선택지별 해설
  // 필요하면 해설 등 추가 가능
}

// 프론트에서 쓰는 퀴즈 데이터
export interface UiQuizData {
  meta: { title: string };
  questions: UiQuestion[];
}
