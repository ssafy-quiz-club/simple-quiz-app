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
  // 보기, 해설, 원본 인덱스를 함께 묶습니다.
  const withIdx = q.choices.map((text, idx) => ({
    text,
    explanation: q.choiceExplanations?.[idx] || '',
    idx,
  }));

  const mixed = fyShuffle(withIdx);

  // 섞은 후 다시 분리합니다.
  const choices = mixed.map(m => m.text);
  const choiceExplanations = mixed.map(m => m.explanation);
  const answer = Math.max(0, mixed.findIndex(m => m.idx === q.answer));

  return { ...q, choices, answer, choiceExplanations };
};
