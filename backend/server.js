import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import stuffRoutes  from './routes/stuff.js';
// import socket from 'socket.io';

dotenv.config();


// Obtenir l'équivalent de __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'application Express
const app = express();
const port = 5000;

// Configuration pour servir les fichiers statiques avec le chemin correct
app.use(express.static(path.join(__dirname, 'public')));


// CONFIG CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',   
    'http://localhost:5173',
    'http://localhost:5000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// app.use(express.json());

app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/api', stuffRoutes);

// const io = socket(server);

// io.on('connection', (socket) => {
//   console.log("Un client s'est connecté", socket.id);
// });

// io.on('connection', socket => {
//   console.log("socket=",socket.id);
//   socket.on('CLIENT_MSG', data => {
//       console.log("msg=",data);
//       io.emit('SERVER_MSG', data);
//   })
// });

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

export default app;