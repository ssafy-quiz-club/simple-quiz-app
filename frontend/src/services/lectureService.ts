import instance from "./axiosInstance";
import type { Lecture } from "../types";

export async function getLectures(): Promise<Lecture[]> {
  const res = await instance.get<Lecture[]>("/lectures"); // baseURL: /api
  return res.data;
}
