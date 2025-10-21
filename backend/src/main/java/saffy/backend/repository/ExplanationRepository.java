
package saffy.backend.repository;

import saffy.backend.entity.Explanation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Long> {
    java.util.List<Explanation> findByQuestionId(Long questionId);
}
