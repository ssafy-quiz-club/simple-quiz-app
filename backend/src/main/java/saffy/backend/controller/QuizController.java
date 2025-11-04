package saffy.backend.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saffy.backend.dto.LectureDto;
import saffy.backend.dto.QuestionDto;
import saffy.backend.dto.SubjectDto;
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

    // 과목 목록
    @GetMapping("/api/subjects")
    public ResponseEntity<List<SubjectDto>> getAllSubjects() {
        return ResponseEntity.ok(quizService.getAllSubjects());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 관리자 인증 (간단 비밀번호)
    @PostMapping("/api/admin/auth")
    public ResponseEntity<String> adminAuth(@RequestBody java.util.Map<String, String> body) {
        String password = body.get("password");
        // 환경변수에서 비밀번호 가져오기 (기본값: admin1234)
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");

        if (adminSecret.equals(password)) {
            return ResponseEntity.ok("인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    // 전체 문제 목록 조회 (관리자용)
    @GetMapping("/api/admin/questions")
    public ResponseEntity<List<QuestionDto>> getAllQuestions(@RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(quizService.getAllQuestions());
    }

    // 문제 삭제 (관리자용)
    @DeleteMapping("/api/admin/questions/{questionId}")
    public ResponseEntity<String> deleteQuestion(
            @PathVariable Long questionId,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않았습니다.");
        }

        try {
            quizService.deleteQuestion(questionId);
            return ResponseEntity.ok("문제가 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 강의 추가 (관리자용)
    @PostMapping("/api/admin/lectures")
    public ResponseEntity<?> createLecture(
            @RequestBody LectureDto lectureDto,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않았습니다.");
        }

        try {
            LectureDto createdLectureDto = quizService.createLecture(lectureDto);
            return ResponseEntity.ok(createdLectureDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("강의 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 강의 삭제 (관리자용)
    @DeleteMapping("/api/admin/lectures/{lectureId}")
    public ResponseEntity<String> deleteLecture(
            @PathVariable Long lectureId,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않았습니다.");
        }

        try {
            quizService.deleteLecture(lectureId);
            return ResponseEntity.ok("강의가 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 과목 추가 (관리자용)
    @PostMapping("/api/admin/subjects")
    public ResponseEntity<?> createSubject(
            @RequestBody SubjectDto subjectDto,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않았습니다.");
        }

        try {
            SubjectDto createdSubjectDto = quizService.createSubject(subjectDto);
            return ResponseEntity.ok(createdSubjectDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("과목 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 과목 삭제 (관리자용)
    @DeleteMapping("/api/admin/subjects/{subjectId}")
    public ResponseEntity<String> deleteSubject(
            @PathVariable Long subjectId,
            @RequestHeader(value = "X-Admin-Secret", required = false) String secret) {
        String adminSecret = System.getenv().getOrDefault("ADMIN_SECRET", "admin1234");
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않았습니다.");
        }

        try {
            quizService.deleteSubject(subjectId);
            return ResponseEntity.ok("과목이 삭제되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
