package saffy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saffy.backend.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
