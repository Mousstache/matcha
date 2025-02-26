// Importation des modules nécessaires
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir l'équivalent de __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const port = 5000;

// Configuration pour servir les fichiers statiques avec le chemin correct
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.tml'));
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// Autre route d'exemple
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', ''));
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});