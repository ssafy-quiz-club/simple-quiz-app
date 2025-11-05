-- 📦 DB 마이그레이션: Question Type (문제 유형) 추가
-- 객관식(MULTIPLE_CHOICE), 주관식(SHORT_ANSWER), OX(TRUE_FALSE) 지원

-- 1️⃣ questions 테이블에 question_type 컬럼 추가
ALTER TABLE questions
ADD COLUMN question_type ENUM('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'TRUE_FALSE')
NOT NULL DEFAULT 'MULTIPLE_CHOICE';

-- 2️⃣ 기존 모든 문제를 객관식(MULTIPLE_CHOICE)으로 설정
UPDATE questions SET question_type = 'MULTIPLE_CHOICE' WHERE question_type IS NULL;

-- ✅ 완료! 이제 문제 유형별로 구분 가능합니다.
-- - MULTIPLE_CHOICE: 객관식 (기존 방식, answers 여러 개)
-- - SHORT_ANSWER: 주관식 (answers 1개만, 정답)
-- - TRUE_FALSE: OX 문제 (answers 2개, 'O'/'X')
