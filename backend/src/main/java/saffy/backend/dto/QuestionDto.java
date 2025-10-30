package saffy.backend.dto;

import java.util.List;
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
    private String content;
    private LectureDto lecture; // 강의 정보
    private List<AnswerDto> answers;  // 각 Answer에 해설 포함됨
}
