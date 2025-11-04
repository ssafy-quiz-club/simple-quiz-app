import instance from "./axiosInstance";
import type { Subject } from "../types";

export async function getSubjects(): Promise<Subject[]> {
  const res = await instance.get<Subject[]>("/subjects");
  return res.data;
}
