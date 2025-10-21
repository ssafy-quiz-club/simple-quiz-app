package saffy.backend.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saffy.backend.dto.LectureDto;
import saffy.backend.dto.QuestionDto;
import saffy.backend.service.QuizService;

@RestController
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "https://zhy2on.github.io",
                "https://ssafy-quiz-club.github.io",
                "https://quiz-api.kro.kr"
        },
        allowCredentials = "true"
)
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/api/ping")
    public String ping() {
        return "pong";
    }

    // 강의 목록
    @GetMapping("/api/lectures")
    public ResponseEntity<List<LectureDto>> getAllLectures() {
        return ResponseEntity.ok(quizService.getAllLectures());
    }

    // 강의별 문제(보기/해설 포함)
    @GetMapping("/api/lectures/{lectureId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestionsByLecture(@PathVariable Long lectureId) {
        try {
            return ResponseEntity.ok(quizService.getByLectureId(lectureId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
