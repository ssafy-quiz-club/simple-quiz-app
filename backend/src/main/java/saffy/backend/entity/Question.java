package saffy.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;  // 질문 + 4개 선택지 포함

    @Column(nullable = false)
    private Integer correctAnswer;  // 정답 번호 (1~4)

    @Column(columnDefinition = "TEXT")
    private String explanation;  // 해설 전체 텍스트

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;
}
