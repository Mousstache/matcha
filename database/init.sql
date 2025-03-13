CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  userName VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  description TEXT,
  preference VARCHAR(50),
  gender VARCHAR(50),
  birthDate DATE,
  age INT,
  interests TEXT,
  isOnline BOOLEAN DEFAULT false,
  lastConnection TIMESTAMP,
  confirmationToken VARCHAR(255),
  confirmationTokenExpires TIMESTAMP,
  emailConfirmed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', 'hashed_password');