package saffy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * JSON 업로드용 DTO
 * 예시 JSON:
 * {
 *   "lectureId": 1,
 *   "questions": [
 *     {
 *       "content": "문제 내용",
 *       "choices": [
 *         {"content": "보기1", "isCorrect": false, "explanation": "O — 설명1"},
 *         {"content": "보기2", "isCorrect": false, "explanation": "O — 설명2"},
 *         {"content": "보기3", "isCorrect": true, "explanation": "X — 설명3"},
 *         {"content": "보기4", "isCorrect": false, "explanation": "O — 설명4"}
 *       ]
 *     }
 *   ]
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadQuestionDto {

    private Long lectureId;
    private List<QuestionItem> questions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionItem {
        private String content;             // 문제 본문
        private List<ChoiceItem> choices;   // 보기 목록 (각 보기에 정답 여부 + 해설)
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChoiceItem {
        private String content;      // 보기 내용
        private boolean isCorrect;   // 정답 여부
        private String explanation;  // 해설
    }
}
