
package com.example.quiz.repository;

import com.example.quiz.domain.Explanation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Long> {
}
