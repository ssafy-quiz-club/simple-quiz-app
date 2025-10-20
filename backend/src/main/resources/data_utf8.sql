-- Quiz App Sample Data (UTF-8 encoded)

-- Insert sample admin
INSERT INTO admins (username, password) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

-- Insert sample questions
INSERT INTO questions (content) VALUES
('What are the 4 main characteristics of Object-Oriented Programming in Java?'),
('What is IoC (Inversion of Control), one of the core features of Spring Framework?'),
('What are the ACID properties in databases?'),
('What is the difference between HTTP and HTTPS?'),
('What are the characteristics of REST API?');

-- Insert sample answers for question 1 (OOP characteristics)
INSERT INTO answers (question_id, content, is_correct) VALUES
(1, 'Encapsulation, Inheritance, Polymorphism, Abstraction', TRUE),
(1, 'Encapsulation, Inheritance, Polymorphism, Serialization', FALSE),
(1, 'Inheritance, Polymorphism, Abstraction, Interface', FALSE),
(1, 'Encapsulation, Class, Object, Method', FALSE);

-- Insert sample answers for question 2 (IoC)
INSERT INTO answers (question_id, content, is_correct) VALUES
(2, 'Object creation and dependency management handled by framework, not developer', TRUE),
(2, 'Controller directly creates services', FALSE),
(2, 'Injecting objects through interfaces', FALSE),
(2, 'Using singleton pattern', FALSE);

-- Insert sample answers for question 3 (ACID)
INSERT INTO answers (question_id, content, is_correct) VALUES
(3, 'Atomicity, Consistency, Isolation, Durability', TRUE),
(3, 'Authentication, Compression, Isolation, Database', FALSE),
(3, 'Atomicity, Connection, Integration, Durability', FALSE),
(3, 'Access, Consistency, Isolation, Data', FALSE);

-- Insert sample answers for question 4 (HTTP vs HTTPS)
INSERT INTO answers (question_id, content, is_correct) VALUES
(4, 'HTTPS is HTTP with SSL/TLS encryption for security', TRUE),
(4, 'HTTP is an older version of HTTPS with enhanced security', FALSE),
(4, 'HTTPS is an improved version of HTTP that provides faster speed', FALSE),
(4, 'No difference', FALSE);

-- Insert sample answers for question 5 (REST API)
INSERT INTO answers (question_id, content, is_correct) VALUES
(5, 'Stateless, Resource-based URLs, HTTP methods usage', TRUE),
(5, 'Stateful, Session-based, XML only', FALSE),
(5, 'Direct database access, SQL query usage', FALSE),
(5, 'Socket communication, real-time data transmission', FALSE);

-- Insert sample explanations
INSERT INTO explanations (question_id, content) VALUES
(1, 'The 4 characteristics of OOP are Encapsulation (bundling data and methods), Inheritance (inheriting properties from existing classes), Polymorphism (same interface with different implementations), and Abstraction (hiding complex implementation and exposing only necessary features).'),
(2, 'IoC (Inversion of Control) means that object creation and dependency management are handled by the framework (container) rather than the developer directly. Spring implements IoC through DI (Dependency Injection).'),
(3, 'ACID represents 4 properties ensuring database transaction safety: Atomicity (transaction succeeds completely or fails completely), Consistency (maintaining consistent database state), Isolation (concurrent transactions do not affect each other), Durability (completed transaction results are permanently stored).'),
(4, 'HTTP transmits data in plain text, while HTTPS is HTTP with SSL/TLS encryption added. HTTPS provides data encryption, server authentication, and data integrity to prevent man-in-the-middle attacks and data eavesdropping.'),
(5, 'Key characteristics of REST API: 1) Stateless: server does not store client state, 2) Resource-based URLs: clear URL structure for resource identification, 3) HTTP method usage: proper use of GET, POST, PUT, DELETE, 4) Representation separation: data can be represented in various formats like JSON, XML.');