import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import { fileURLToPath } from 'url';
import { syncDatabase } from './models/index.js';
import { connectDB } from './config/db.js';

import stuffRoutes  from './routes/stuff.js';
import authRoutes from './routes/auth.js';



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

// CONFIG CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',   // React
    'http://localhost:5173',   // Vite
    'http://localhost:5000',   // Votre serveur backend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// img
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_pictures", // 📁 Dossier où stocker les images
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// app.use('/api/auth', authRoutes);
app.use('/api', stuffRoutes);

app.get('/', (req, res) => {
  console.log(__dirname);
  res.send('API est en cours d\'exécution');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

export default app;