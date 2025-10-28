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
 *       "choices": ["보기1", "보기2", "보기3", "보기4"],
 *       "answerIndex": 0,
 *       "explanation": "해설 내용"
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
        private String content;           // 문제 본문
        private List<String> choices;     // 보기 목록
        private Integer answerIndex;      // 정답 인덱스 (0부터 시작)
        private String explanation;       // 해설 (선택)
    }
}
