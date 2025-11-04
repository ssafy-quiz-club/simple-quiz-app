import instance from "./axiosInstance";
import type { ApiQuestionDto, Lecture, Subject } from "../types";

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

export async function addLectureAdmin(name: string, subjectId: number, secret: string): Promise<Lecture> {
  const res = await instance.post<Lecture>('/admin/lectures', { name, subjectId }, {
    headers: { 'X-Admin-Secret': secret }
  });
  return res.data;
}

export async function deleteLectureAdmin(lectureId: number, secret: string): Promise<void> {
  await instance.delete(`/admin/lectures/${lectureId}`, {
    headers: { 'X-Admin-Secret': secret }
  });
}

export async function addSubjectAdmin(name: string, secret: string): Promise<Subject> {
  const res = await instance.post<Subject>('/admin/subjects', { name }, {
    headers: { 'X-Admin-Secret': secret }
  });
  return res.data;
}

export async function deleteSubjectAdmin(subjectId: number, secret: string): Promise<void> {
  await instance.delete(`/admin/subjects/${subjectId}`, {
    headers: { 'X-Admin-Secret': secret }
  });
}
