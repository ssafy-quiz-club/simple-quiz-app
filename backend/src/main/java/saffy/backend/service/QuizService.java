package saffy.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import saffy.backend.dto.AnswerDto;
import saffy.backend.dto.ExplanationDto;
import saffy.backend.dto.LectureDto;
import saffy.backend.dto.QuestionDto;
import saffy.backend.dto.UploadQuestionDto;
import saffy.backend.entity.Answer;
import saffy.backend.entity.Explanation;
import saffy.backend.entity.Lecture;
import saffy.backend.entity.Question;
import saffy.backend.repository.AnswerRepository;
import saffy.backend.repository.ExplanationRepository;
import saffy.backend.repository.LectureRepository;
import saffy.backend.repository.QuestionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ExplanationRepository explanationRepository;
    private final LectureRepository lectureRepository;

    /** 강의 전체 목록 조회 */
    public List<LectureDto> getAllLectures() {
        return lectureRepository.findAll().stream()
                .map(this::toLectureDto)
                .toList();
    }

    /** 강의별 문제(보기/해설 포함) 조회 */
    public List<QuestionDto> getByLectureId(Long lectureId) {
        lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 강의를 찾을 수 없습니다: " + lectureId));

        return questionRepository.findByLecture_Id(lectureId).stream()
                .map(this::toQuestionDtoWithChildren)
                .toList();
    }

    // ====== DTO 매핑 ======
    private LectureDto toLectureDto(Lecture lec) {
        return new LectureDto(lec.getId(), lec.getName());
    }

    private QuestionDto toQuestionDtoWithChildren(Question q) {
        // Question -> Lecture -> LectureDto
        LectureDto lectureDto = toLectureDto(q.getLecture());

        List<AnswerDto> answers = answerRepository.findByQuestionId(q.getId())
                .stream()
                .map(this::toAnswerDto)
                .toList();

        List<ExplanationDto> exps = explanationRepository.findByQuestionId(q.getId())
                .stream()
                .map(this::toExplanationDto)
                .toList();

        return new QuestionDto(q.getId(), q.getContent(), lectureDto, answers, exps);
    }

    private AnswerDto toAnswerDto(Answer a) {
        return new AnswerDto(a.getId(), a.getContent(), a.isCorrect());
    }

    private ExplanationDto toExplanationDto(Explanation e) {
        return new ExplanationDto(e.getId(), e.getContent());
    }

    /**
     * JSON 데이터 업로드
     * 여러 문제를 한 번에 추가할 수 있음
     */
    @Transactional
    public void uploadQuestions(UploadQuestionDto dto) {
        // 1. 강의 확인
        Lecture lecture = lectureRepository.findById(dto.getLectureId())
                .orElseThrow(() -> new IllegalArgumentException("강의 ID " + dto.getLectureId() + "를 찾을 수 없습니다."));

        // 2. 각 문제 저장
        for (UploadQuestionDto.QuestionItem item : dto.getQuestions()) {
            // Question 생성
            Question question = new Question();
            question.setContent(item.getContent());
            question.setLecture(lecture);
            questionRepository.save(question);

            // Answer 생성 (보기들)
            if (item.getChoices() != null) {
                for (int i = 0; i < item.getChoices().size(); i++) {
                    Answer answer = new Answer();
                    answer.setContent(item.getChoices().get(i));
                    answer.setCorrect(i == item.getAnswerIndex()); // 정답 여부
                    answer.setQuestion(question);
                    answerRepository.save(answer);
                }
            }

            // Explanation 생성 (선택)
            if (item.getExplanation() != null && !item.getExplanation().isEmpty()) {
                Explanation explanation = new Explanation();
                explanation.setContent(item.getExplanation());
                explanation.setQuestion(question);
                explanationRepository.save(explanation);
            }
        }
    }

    /**
     * 전체 문제 목록 조회 (관리자용)
     */
    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::toQuestionDtoWithChildren)
                .toList();
    }

    /**
     * 문제 삭제
     */
    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("문제 ID " + questionId + "를 찾을 수 없습니다."));
        questionRepository.delete(question);
    }

    /**
     * 강의 추가
     */
    @Transactional
    public LectureDto createLecture(LectureDto lectureDto) {
        Lecture newLecture = new Lecture();
        newLecture.setName(lectureDto.getName());
        Lecture savedLecture = lectureRepository.save(newLecture);
        return toLectureDto(savedLecture);
    }

    /**
     * 강의 삭제
     */
    @Transactional
    public void deleteLecture(Long lectureId) {
        // 해당 강의에 속한 문제가 있는지 확인
        if (questionRepository.existsByLectureId(lectureId)) {
            throw new IllegalStateException("해당 강의에 속한 문제가 있어 삭제할 수 없습니다.");
        }
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("강의 ID " + lectureId + "를 찾을 수 없습니다."));
        lectureRepository.delete(lecture);
    }
}
