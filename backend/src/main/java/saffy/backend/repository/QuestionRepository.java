
package saffy.backend.repository;

import java.util.List;
import saffy.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLecture_Id(Long lectureId);
}
