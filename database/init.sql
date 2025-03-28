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
    message_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_match ON messages(match_id);
CREATE INDEX idx_sender ON messages(sender_id);
CREATE INDEX idx_created ON messages(created_at);




CREATE TABLE blocks (
  block_id SERIAL PRIMARY KEY,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blocker_id, blocked_id),
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL, 
    reported_id INT NOT NULL, 
    reason TEXT NOT NULL CHECK (reason IN ('fake account')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(reporter_id, reported_id) 
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
 'Femme', 'Homme', '1990-05-14', 34, 'voyage,photo,lecture', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 48.8566, 2.3522, 'Paris', 'France', NULL, NULL, false, NOW(), NOW()),

('alice.smith@example.com', 'hashedpassword2', 'alicesmith', 'Alice', 'Smith', 'Amatrice de cuisine et de sport.', 
 'Homme', 'FeHomme', '1995-08-22', 29, 'cuisine,sport,musique', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 40.7128, -74.0060, 'New York', 'USA', NULL, NULL, false, NOW(), NOW()),

('michael.brown@example.com', 'hashedpassword3', 'michaelb', 'Michael', 'Brown', 'Geek de la technologie et des jeux vidéo.', 
 'Femme', 'Homme', '1988-02-10', 36, 'jeux,technologie,cinéma', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 51.5074, -0.1278, 'London', 'UK', NULL, NULL, false, NOW(), NOW()),

('sophia.johnson@example.com', 'hashedpassword4', 'sophiaj', 'Sophia', 'Johnson', 'Grande passionnée d’art et de dessin.', 
 'Homme', 'Femme', '1997-06-30', 27, 'art,dessin,musique', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 34.0522, -118.2437, 'Los Angeles', 'USA', NULL, NULL, false, NOW(), NOW()),

('william.taylor@example.com', 'hashedpassword5', 'williamt', 'William', 'Taylor', 'Fan de randonnée et de nature.', 
 'Femme', 'Homme', '1993-11-05', 31, 'randonnée,nature,lecture', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 41.9028, 12.4964, 'Rome', 'Italy', NULL, NULL, false, NOW(), NOW()),

('emma.martin@example.com', 'hashedpassword6', 'emmam', 'Emma', 'Martin', 'J’adore la danse et le théâtre.', 
 'Homme', 'Femme', '2000-01-12', 24, 'danse,théâtre,lecture', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 35.6895, 139.6917, 'Tokyo', 'Japan', NULL, NULL, false, NOW(), NOW()),

('james.white@example.com', 'hashedpassword7', 'jamesw', 'James', 'White', 'Passionné de sport et de fitness.', 
 'Les deux', 'Homme', '1985-07-19', 39, 'sport,fitness,musique', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 55.7558, 37.6173, 'Moscow', 'Russia', NULL, NULL, false, NOW(), NOW()),

('olivia.davis@example.com', 'hashedpassword8', 'oliviad', 'Olivia', 'Davis', 'Grande lectrice et écrivaine amateur.', 
 'Homme', 'Femme', '1998-09-25', 26, 'lecture,écriture,histoire', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 37.7749, -122.4194, 'San Francisco', 'USA', NULL, NULL, false, NOW(), NOW()),

('benjamin.moore@example.com', 'hashedpassword9', 'benjaminm', 'Benjamin', 'Moore', 'Fan de science-fiction et d’astronomie.', 
 'Femme', 'Homme', '1992-04-17', 32, 'science-fiction,astronomie,jeux', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 28.7041, 77.1025, 'Delhi', 'India', NULL, NULL, false, NOW(), NOW()),

('charlotte.thomas@example.com', 'hashedpassword10', 'charlottet', 'Charlotte', 'Thomas', 'Amoureuse des animaux et de la nature.', 
 'Homme', 'Femme', '1996-12-03', 28, 'animaux,nature,photographie', '@/frontend/src/assets/images/robbieLens.jpeg', 
 false, NULL, 0, 48.1351, 11.5820, 'Munich', 'Germany', NULL, NULL, false, NOW(), NOW());
