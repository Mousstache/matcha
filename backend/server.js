import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import { fileURLToPath } from 'url';
// import { connectDB } from './config/db.js';

import stuffRoutes  from './routes/stuff.js';




dotenv.config();
// connectDB();
// syncDatabase();



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

app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });


app.post("/api/upload", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: "Aucune image reçue" });
    }
    
    // Récupérer les URLs des images uploadées
    const images = req.files.map((file) => file.path);
    const profilePicture = images[0];
    
    // const token = req.headers.authorization?.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;
    
    // const user = await User.findByPk(userId);
    
    await user.update(req.body.images);
    
    res.status(200).json({ message: "Images uploadées avec succès", images });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'upload des images" });
  }
});

app.use(express.json({ limit: "10mb" }));

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