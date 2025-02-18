import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Matcha' });
});

app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Route pour les utilisateurs (exemple)
app.get('/api/users', (_req, res) => {
  res.json([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' }
  ]);
});

// Gestion des routes inconnues
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;