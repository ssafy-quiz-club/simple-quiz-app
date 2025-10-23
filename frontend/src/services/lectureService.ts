import instance from "./axiosInstance";
import type { Lecture } from "../types";

// 강의 목록 가져오기
export const getLectures = async (): Promise<Lecture[]> => {
  const res = await instance.get<Lecture[]>("/lectures");
  return res.data;
};

// (옵션) 특정 강의의 문제 목록 가져오기 — 나중에 확장용
// export const getQuestionsByLecture = async (lectureId: number) => {
//   const res = await instance.get(`/lectures/${lectureId}/questions`);
//   return res.data;
// };
