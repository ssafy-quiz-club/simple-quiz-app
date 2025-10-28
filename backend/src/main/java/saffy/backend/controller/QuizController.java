package saffy.backend.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saffy.backend.dto.LectureDto;
import saffy.backend.dto.QuestionDto;
import saffy.backend.dto.UploadQuestionDto;
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

    // JSON 업로드로 문제 추가
    @PostMapping("/api/questions/upload")
    public ResponseEntity<String> uploadQuestions(@RequestBody UploadQuestionDto dto) {
        try {
            quizService.uploadQuestions(dto);
            return ResponseEntity.ok("문제가 성공적으로 추가되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
