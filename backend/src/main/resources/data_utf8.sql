

-- 🎯 Quiz App 샘플 데이터 (UTF-8 인코딩)
-- 강의(lectures) → 문제(questions) → 보기(answers) → 해설(explanations)
-- 순서대로 INSERT 해야 외래키 오류가 안 납니다.

-- ✅ 1. 관리자(admins) 등록
INSERT INTO admins (username, password) VALUES
    ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
-- 비밀번호: password (BCrypt 암호화됨)

-- ✅ 2. 강의(lectures) 등록
INSERT INTO lectures (name) VALUES
                                ('Java 기본'),
                                ('Spring Framework'),
                                ('데이터베이스'),
                                ('네트워크'),
                                ('REST API 설계');

-- ✅ 3. 문제(questions) 등록
-- 각 question에 lectures_id를 연결합니다.
INSERT INTO questions (content, lecture_id) VALUES
                                                 ('자바의 객체지향 프로그래밍(OOP)의 4가지 핵심 특징은 무엇인가요?', 1),
                                                 ('스프링 프레임워크의 핵심 개념 중 하나인 IoC(Inversion of Control)는 무엇인가요?', 2),
                                                 ('데이터베이스 트랜잭션의 ACID 특성은 무엇인가요?', 3),
                                                 ('HTTP와 HTTPS의 차이점은 무엇인가요?', 4),
                                                 ('REST API의 주요 특징은 무엇인가요?', 5);

-- ✅ 4. 보기(answers) 등록

-- 문제 1: OOP 특징
INSERT INTO answers (question_id, content, is_correct) VALUES
                                                           (1, '캡슐화, 상속, 다형성, 추상화', TRUE),
                                                           (1, '캡슐화, 상속, 다형성, 직렬화', FALSE),
                                                           (1, '상속, 다형성, 추상화, 인터페이스', FALSE),
                                                           (1, '캡슐화, 클래스, 객체, 메서드', FALSE);

-- 문제 2: IoC
INSERT INTO answers (question_id, content, is_correct) VALUES
                                                           (2, '객체 생성과 의존성 관리를 개발자가 아닌 프레임워크가 담당하는 개념', TRUE),
                                                           (2, 'Controller가 직접 Service를 생성하는 방식', FALSE),
                                                           (2, '인터페이스를 통한 객체 주입', FALSE),
                                                           (2, '싱글톤 패턴 사용', FALSE);

-- 문제 3: ACID
INSERT INTO answers (question_id, content, is_correct) VALUES
                                                           (3, '원자성, 일관성, 고립성, 지속성', TRUE),
                                                           (3, '인증, 압축, 고립성, 데이터베이스', FALSE),
                                                           (3, '원자성, 연결성, 통합성, 지속성', FALSE),
                                                           (3, '접근성, 일관성, 고립성, 데이터', FALSE);

-- 문제 4: HTTP vs HTTPS
INSERT INTO answers (question_id, content, is_correct) VALUES
                                                           (4, 'HTTPS는 HTTP에 SSL/TLS 암호화 계층을 추가하여 보안을 강화한 프로토콜입니다.', TRUE),
                                                           (4, 'HTTP는 HTTPS보다 보안이 강화된 최신 버전입니다.', FALSE),
                                                           (4, 'HTTPS는 HTTP보다 속도가 빠릅니다.', FALSE),
                                                           (4, '둘은 완전히 동일합니다.', FALSE);

-- 문제 5: REST API 특징
INSERT INTO answers (question_id, content, is_correct) VALUES
                                                           (5, '무상태성(Stateless), 자원 기반 URL, HTTP 메서드 활용', TRUE),
                                                           (5, '상태유지, 세션 기반, XML 전용 통신', FALSE),
                                                           (5, 'DB 직접 접근, SQL 쿼리 호출', FALSE),
                                                           (5, '소켓 통신 기반의 실시간 데이터 전송', FALSE);

-- ✅ 5. 해설(explanations) 등록
INSERT INTO explanations (question_id, content) VALUES
                                                    (1, '객체지향의 4대 특징은 다음과 같습니다. 캡슐화(데이터와 메서드를 하나로 묶음), 상속(기존 클래스의 재사용), 다형성(동일한 인터페이스로 다른 동작 수행), 추상화(불필요한 구현 세부사항을 숨김).'),
                                                    (2, 'IoC(Inversion of Control)는 객체 생성과 의존성 관리의 제어권을 개발자에서 프레임워크로 역전시킨 개념입니다. 스프링은 DI(Dependency Injection)를 통해 IoC를 구현합니다.'),
                                                    (3, 'ACID는 트랜잭션의 안전성을 보장하는 네 가지 속성입니다. 원자성(모두 수행 또는 모두 실패), 일관성(데이터 무결성 유지), 고립성(동시 트랜잭션 간 간섭 방지), 지속성(커밋된 결과는 영구 반영).'),
                                                    (4, 'HTTP는 데이터를 평문으로 전송하지만, HTTPS는 SSL/TLS 암호화를 적용해 데이터 보안과 무결성을 보장합니다. 이를 통해 중간자 공격 및 도청을 방지할 수 있습니다.'),
                                                    (5, 'REST API는 ① 무상태성(Stateless), ② 자원 기반 URI, ③ HTTP 메서드의 명확한 사용(GET, POST, PUT, DELETE 등), ④ 다양한 표현(JSON, XML 등)을 특징으로 합니다.');
