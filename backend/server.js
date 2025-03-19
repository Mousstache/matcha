import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer } from 'http'; // Créer un serveur HTTP
import { Server } from 'socket.io';  // Import correct de socket.io
import stuffRoutes from './routes/stuff.js';

dotenv.config();

// Obtenir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const port = 5000;

// Création du serveur HTTP
const server = createServer(app);

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware JSON
app.use(express.json({ limit: "50mb" }));

// Routes API
app.use('/api', stuffRoutes);

// Initialisation de Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log("Un client s'est connecté", socket.id);

  socket.on('CLIENT_MSG', (data) => {
    console.log("Message reçu :", data);
    io.emit('SERVER_MSG', data);
  });

  socket.on('disconnect', () => {
    console.log(`Le client ${socket.id} s'est déconnecté`);
  });
});

// Démarrage du serveur HTTP
server.listen(port, () => {
  console.log(`Serveur WebSocket et API démarré sur http://localhost:${port}`);
});

export default app;