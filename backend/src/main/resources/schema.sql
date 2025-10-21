-- Quiz App Database Schema

-- Create admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL
);

-- Create questions table
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecture_id INT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);

-- Create answers table
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create explanations table
CREATE TABLE explanations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create explanations table
CREATE TABLE lectures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
