import instance from "./axiosInstance";
import type { ApiQuestionDto } from "../types";

export async function getQuestionsByLecture(lectureId: number): Promise<ApiQuestionDto[]> {
  const res = await instance.get<ApiQuestionDto[]>(`/lectures/${lectureId}/questions`);
  return res.data;
}
