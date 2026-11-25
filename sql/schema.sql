-- TalentLens schema (MySQL / MariaDB via XAMPP)
CREATE DATABASE IF NOT EXISTS talentlens CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talentlens;

DROP TABLE IF EXISTS chat_logs;
DROP TABLE IF EXISTS decisions;
DROP TABLE IF EXISTS challenge_results;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS vacancies;

CREATE TABLE vacancies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  client VARCHAR(150) NOT NULL,
  location VARCHAR(100) DEFAULT 'Kampala',
  positions INT DEFAULT 1,
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  blueprint_json LONGTEXT NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  gender VARCHAR(20),
  age INT,
  school VARCHAR(150),
  education VARCHAR(150),
  years_experience INT DEFAULT 0,
  phone VARCHAR(30),
  channel VARCHAR(20) DEFAULT 'web',
  accommodations VARCHAR(255) NULL,
  comm_pref VARCHAR(40) DEFAULT 'Phone call',
  profile_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  vacancy_id INT NOT NULL,
  source VARCHAR(20) DEFAULT 'applied',
  status VARCHAR(30) DEFAULT 'Received',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_app (candidate_id, vacancy_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE
);

CREATE TABLE challenge_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  vacancy_id INT NOT NULL,
  score INT NOT NULL,
  detail_json LONGTEXT NULL,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE
);

CREATE TABLE decisions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  vacancy_id INT NOT NULL,
  action VARCHAR(20) NOT NULL,
  reason TEXT NOT NULL,
  recruiter VARCHAR(100) DEFAULT 'Recruiter',
  ai_score INT,
  is_override TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE
);

CREATE TABLE chat_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NULL,
  question TEXT,
  answer TEXT,
  intent VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
