-- 📦 DB 마이그레이션: Subject(과목) 테이블 추가
-- 실행 순서대로 따라가세요!

-- 1️⃣ subjects 테이블 생성
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- 2️⃣ AI 과목 추가
INSERT INTO subjects (name) VALUES ('AI');

-- 3️⃣ lectures 테이블에 subject_id 컬럼 추가 (일단 nullable로)
ALTER TABLE lectures ADD COLUMN subject_id BIGINT NULL;

-- 4️⃣ 모든 기존 강의를 AI 과목(id=1)으로 설정
UPDATE lectures SET subject_id = 1 WHERE subject_id IS NULL;

-- 5️⃣ subject_id를 NOT NULL로 변경
ALTER TABLE lectures MODIFY COLUMN subject_id BIGINT NOT NULL;

-- 6️⃣ 외래키 제약조건 추가
ALTER TABLE lectures ADD CONSTRAINT fk_lectures_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;

-- ✅ 완료! 이제 모든 강의가 AI 과목에 속합니다.
