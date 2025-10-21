package saffy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import saffy.backend.entity.Lecture;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
}
