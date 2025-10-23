export interface Question {
  id: string;
  type: string;
  question: string;
  choices: string[];
  answer: number;
  explanation?: string;
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

export interface Lecture {
  id: number;
  name: string;
}
