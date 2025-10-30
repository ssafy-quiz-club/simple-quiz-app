package saffy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private Long id;
    private String content;  // 질문 + 4개 선택지 포함
    private Integer correctAnswer;  // 정답 번호 (1~4)
    private String explanation;  // 해설
    private LectureDto lecture;  // 강의 정보
}
