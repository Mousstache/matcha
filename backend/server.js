// Importation des modules nécessaires
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import syncDatabase from './models'; 


dotenv.config();

connectDB();

syncDatabase();

// Obtenir l'équivalent de __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const port = 5000;

// Configuration pour servir les fichiers statiques avec le chemin correct
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour parser le JSON
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(cors());

// Route pour la page d'accueil

app.get('/', (req, res) => {
  console.log(__dirname);
  res.send('API est en cours d\'exécution');
});

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/api/match', (req, res, next) => {
  res.status(200).json({
    message: 'Match found!'
  });
}),

app.post('/api/user', (req, res, next) => {
  const formData = req.body;
  console.log(formData);
  res.status(201).json({
    message: 'User created! loool',
    user: formData,
  });
});

// Autre route d'exemple
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', ''));
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});