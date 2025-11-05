package saffy.backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import saffy.backend.entity.QuestionType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private Long id;
    private String content;
    private QuestionType questionType;  // 문제 유형 (MULTIPLE_CHOICE, SHORT_ANSWER, TRUE_FALSE)
    private LectureDto lecture; // 강의 정보
    private List<AnswerDto> answers;  // 각 Answer에 해설 포함됨
    private String explanation; // 문제 전체에 대한 해설
}
