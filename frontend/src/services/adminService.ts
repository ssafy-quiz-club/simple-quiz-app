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
