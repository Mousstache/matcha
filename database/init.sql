CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales
INSERT INTO users (name, email) VALUES 
  ('Jean Dupont', 'jean@exemple.fr'),
  ('Marie Martin', 'marie@exemple.fr');