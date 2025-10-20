package saffy.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import saffy.backend.domain.Question;
import saffy.backend.domain.Answer;
import saffy.backend.repository.QuestionRepository;
import saffy.backend.repository.AnswerRepository;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @GetMapping("/api/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/api/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/api/questions/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        Optional<Question> question = questionRepository.findById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @GetMapping("/api/questions/{id}/answers")
    public ResponseEntity<List<Answer>> getAnswersForQuestion(@PathVariable Long id) {
        List<Answer> answers = answerRepository.findByQuestionId(id);
        return ResponseEntity.ok(answers);
    }

    @PostMapping("/api/questions/{questionId}/answers")
    public ResponseEntity<Answer> addAnswerToQuestion(@PathVariable Long questionId, @RequestBody Answer answer) {
        Optional<Question> question = questionRepository.findById(questionId);
        if (question.isPresent()) {
            answer.setQuestion(question.get());
            Answer savedAnswer = answerRepository.save(answer);
            return ResponseEntity.ok(savedAnswer);
        }
        return ResponseEntity.notFound().build();
    }
}
