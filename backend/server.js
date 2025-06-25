import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import stuffRoutes from './routes/stuff.js';
import userCtrl from "./controllers/userControllers.js";
import { seedUsersIfEmpty } from './scripts/seedUsers.js';

dotenv.config();

(async () => {
  await seedUsersIfEmpty();
})();
// await seedUsersIfEmpty(); 

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


const connectedUsers = {};

const notifications = {}; 


io.on("connection", (socket) => {
  
  socket.on("userConnected", (userId) => {
    for (const id in connectedUsers) {
      if (connectedUsers[id] === socket.id) {
          delete connectedUsers[id];
      }
  }

  connectedUsers[userId] = socket.id;
  });
  
  socket.on("CLIENT_MesSaGes", async (message) => {

    const receiverSocketId = connectedUsers[message.receiverId]; 

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("SERVER_MSG", message);
    }

  });


  
  socket.on("SEND_NOTIFICATION", ({ userId, type,  message }) => {
    if (!notifications[userId]) {
      notifications[userId] = [];
    }

    const newNotification = { type, message, is_read:false,  created_at: new Date() };
    notifications[userId].push(newNotification);
    
    
    // Vérifier si l'utilisateur est en ligne
    const userSocketId = connectedUsers[userId];
    if (userSocketId) {
      io.to(userSocketId).emit("RECEIVE_NOTIFICATION", newNotification);
      
      // Si c'est un message de chat, émettre aussi un événement spécifique pour le toast
      if (type === "message") {
        io.to(userSocketId).emit("message", newNotification);
      }
    }
  });
  
  
  // Supprimer l'utilisateur quand il se déconnecte
  socket.on("disconnect", () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
  
});

app.set("io", io);
app.set("connectedUsers", connectedUsers);

// Démarrage du serveur HTTP
server.listen(port, () => {
});

// Exportation compatible ES Modules
export { io, connectedUsers };
export default app;
