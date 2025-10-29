import instance from "./axiosInstance";
import type { ApiQuestionDto } from "../types";

export async function adminAuth(password: string): Promise<boolean> {
  try {
    await instance.post('/admin/auth', { password });
    return true;
  } catch {
    return false;
  }
}

export async function getAllQuestionsAdmin(secret: string): Promise<ApiQuestionDto[]> {
  const res = await instance.get<ApiQuestionDto[]>('/admin/questions', {
    headers: { 'X-Admin-Secret': secret }
  });
  return res.data;
}

export async function deleteQuestionAdmin(questionId: number, secret: string): Promise<void> {
  await instance.delete(`/admin/questions/${questionId}`, {
    headers: { 'X-Admin-Secret': secret }
  });
}

export async function addLectureAdmin(name: string, secret: string): Promise<Lecture> {
  const res = await instance.post<Lecture>('/admin/lectures', { name }, {
    headers: { 'X-Admin-Secret': secret }
  });
  return res.data;
}

export async function deleteLectureAdmin(lectureId: number, secret: string): Promise<void> {
  await instance.delete(`/admin/lectures/${lectureId}`, {
    headers: { 'X-Admin-Secret': secret }
  });
}
