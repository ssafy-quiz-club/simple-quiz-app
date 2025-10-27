// src/utils/shuffle.ts
import type { UiQuestion } from "../types";

// ✅ 편향 없는 Fisher–Yates 셔플
export const fyShuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ✅ 보기(choices) 섞고 정답 인덱스 보정
export const shuffleChoicesForUiQuestion = (q: UiQuestion): UiQuestion => {
  const withIdx = q.choices.map((text, idx) => ({ text, idx }));
  const mixed = fyShuffle(withIdx);
  const choices = mixed.map(m => m.text);
  const answer = Math.max(0, mixed.findIndex(m => m.idx === q.answer));
  return { ...q, choices, answer };
};
