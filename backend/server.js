import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer } from 'http'; // Créer un serveur HTTP
import { Server } from 'socket.io';  // Import correct de socket.io
import stuffRoutes from './routes/stuff.js';
import userCtrl from "./controllers/userControllers.js";
// import { setSocket } from './controllers/userControllers.js';

dotenv.config();

// Obtenir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const port = 5001;

// Création du serveur HTTP
const server = createServer(app);

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-control'],
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


const connectedUsers = {}; // Stocke les utilisateurs connectés

io.on("connection", (socket) => {
  console.log(`Utilisateur connecté : ${socket.id}`);

  // Associe un utilisateur à son socket lorsqu'il s'authentifie
  socket.on("userConnected", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log("Utilisateurs connectés:", connectedUsers);
  });

  // Supprime l'utilisateur quand il se déconnecte
  socket.on("disconnect", () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

// userCtrl.setSocket(io);

export { io, connectedUsers };

// io.on('connection', (socket) => {
//   console.log("Un client s'est connecté", socket.id);

//   socket.on('CLIENT_MSG', (data) => {
//     console.log("Message reçu :", data);
//     io.emit('SERVER_MSG', data);
//   });

//   socket.on('disconnect', () => {
//     console.log(`Le client ${socket.id} s'est déconnecté`);
//   });
// });

// Démarrage du serveur HTTP
server.listen(port, () => {
  console.log(`Serveur WebSocket et API démarré sur http://localhost:${port}`);
});

export default app;