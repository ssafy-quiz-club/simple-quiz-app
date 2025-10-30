import instance from "./axiosInstance";
import type { ApiQuestionDto } from "../types";

export async function getQuestionsByLecture(lectureId: number): Promise<ApiQuestionDto[]> {
  const res = await instance.get<ApiQuestionDto[]>(`/lectures/${lectureId}/questions`);
  return res.data;
}

export interface UploadQuestionData {
  lectureId: number;
  questions: {
    content: string;
    choices: {
      content: string;
      isCorrect: boolean;
      explanation: string;
    }[];
  }[];
}

export async function uploadQuestions(data: UploadQuestionData): Promise<string> {
  const res = await instance.post<string>('/questions/upload', data);
  return res.data;
}
