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
  profile_picture VARCHAR(255),
  isOnline BOOLEAN DEFAULT false,
  lastConnection TIMESTAMP,
  fame_rate INT DEFAULT 0,
  latitude FLOAT,
  longitude FLOAT,
  city VARCHAR(255),
  country VARCHAR(255),
  confirmationToken VARCHAR(255),
  confirmationTokenExpires TIMESTAMP,
  emailConfirmed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profile_views (
  id SERIAL PRIMARY KEY,
  viewer_id INTEGER NOT NULL REFERENCES users(id),
  viewed_id INTEGER NOT NULL REFERENCES users(id),
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(viewer_id, viewed_id)
);


CREATE TABLE IF NOT EXISTS likes (
    like_id SERIAL PRIMARY KEY,
    liker_id INT NOT NULL,
    liked_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (liker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (liked_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (liker_id, liked_id)
);

CREATE INDEX idx_liker ON likes (liker_id);
CREATE INDEX idx_liked ON likes (liked_id);


CREATE TABLE IF NOT EXISTS matches (
    match_id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user1_id, user2_id)
);

CREATE INDEX idx_user1 ON matches (user1_id);
CREATE INDEX idx_user2 ON matches (user2_id);
CREATE INDEX idx_last_message ON matches (last_message_at);

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_match (match_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created (created_at)
);


INSERT INTO users (
  email, password, userName, firstName, lastName, description, 
  preference, gender, birthDate, age, interests, profile_picture, 
  isOnline, lastConnection, fame_rate, latitude, longitude, 
  city, country, confirmationToken, confirmationTokenExpires, 
  emailConfirmed, createdAt, updatedAt
) 
VALUES
('john.doe@example.com', 'hashedpassword1', 'johndoe', 'John', 'Doe', 'Passionné de voyage et de photographie.', 
 'Women', 'Male', '1990-05-14', 34, 'voyage,photo,lecture', 'profile1.jpg', 
 false, NULL, 0, 48.8566, 2.3522, 'Paris', 'France', NULL, NULL, false, NOW(), NOW()),

('alice.smith@example.com', 'hashedpassword2', 'alicesmith', 'Alice', 'Smith', 'Amatrice de cuisine et de sport.', 
 'Men', 'Female', '1995-08-22', 29, 'cuisine,sport,musique', 'profile2.jpg', 
 false, NULL, 0, 40.7128, -74.0060, 'New York', 'USA', NULL, NULL, false, NOW(), NOW()),

('michael.brown@example.com', 'hashedpassword3', 'michaelb', 'Michael', 'Brown', 'Geek de la technologie et des jeux vidéo.', 
 'Women', 'Male', '1988-02-10', 36, 'jeux,technologie,cinéma', 'profile3.jpg', 
 false, NULL, 0, 51.5074, -0.1278, 'London', 'UK', NULL, NULL, false, NOW(), NOW()),

('sophia.johnson@example.com', 'hashedpassword4', 'sophiaj', 'Sophia', 'Johnson', 'Grande passionnée d’art et de dessin.', 
 'Men', 'Female', '1997-06-30', 27, 'art,dessin,musique', 'profile4.jpg', 
 false, NULL, 0, 34.0522, -118.2437, 'Los Angeles', 'USA', NULL, NULL, false, NOW(), NOW()),

('william.taylor@example.com', 'hashedpassword5', 'williamt', 'William', 'Taylor', 'Fan de randonnée et de nature.', 
 'Women', 'Male', '1993-11-05', 31, 'randonnée,nature,lecture', 'profile5.jpg', 
 false, NULL, 0, 41.9028, 12.4964, 'Rome', 'Italy', NULL, NULL, false, NOW(), NOW()),

('emma.martin@example.com', 'hashedpassword6', 'emmam', 'Emma', 'Martin', 'J’adore la danse et le théâtre.', 
 'Men', 'Female', '2000-01-12', 24, 'danse,théâtre,lecture', 'profile6.jpg', 
 false, NULL, 0, 35.6895, 139.6917, 'Tokyo', 'Japan', NULL, NULL, false, NOW(), NOW()),

('james.white@example.com', 'hashedpassword7', 'jamesw', 'James', 'White', 'Passionné de sport et de fitness.', 
 'Both', 'Male', '1985-07-19', 39, 'sport,fitness,musique', 'profile7.jpg', 
 false, NULL, 0, 55.7558, 37.6173, 'Moscow', 'Russia', NULL, NULL, false, NOW(), NOW()),

('olivia.davis@example.com', 'hashedpassword8', 'oliviad', 'Olivia', 'Davis', 'Grande lectrice et écrivaine amateur.', 
 'Men', 'Female', '1998-09-25', 26, 'lecture,écriture,histoire', 'profile8.jpg', 
 false, NULL, 0, 37.7749, -122.4194, 'San Francisco', 'USA', NULL, NULL, false, NOW(), NOW()),

('benjamin.moore@example.com', 'hashedpassword9', 'benjaminm', 'Benjamin', 'Moore', 'Fan de science-fiction et d’astronomie.', 
 'Women', 'Male', '1992-04-17', 32, 'science-fiction,astronomie,jeux', 'profile9.jpg', 
 false, NULL, 0, 28.7041, 77.1025, 'Delhi', 'India', NULL, NULL, false, NOW(), NOW()),

('charlotte.thomas@example.com', 'hashedpassword10', 'charlottet', 'Charlotte', 'Thomas', 'Amoureuse des animaux et de la nature.', 
 'Men', 'Female', '1996-12-03', 28, 'animaux,nature,photographie', 'profile10.jpg', 
 false, NULL, 0, 48.1351, 11.5820, 'Munich', 'Germany', NULL, NULL, false, NOW(), NOW());
