package saffy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saffy.backend.entity.Explanation;

import java.util.Optional;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Long> {
    Optional<Explanation> findByQuestionId(Long questionId);
}
