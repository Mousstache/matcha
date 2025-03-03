// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 5000;

// // Configuration de la connexion PostgreSQL
// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: 5432
// });

// app.use(cors());
// app.use(express.json());

// // Route pour obtenir tous les utilisateurs
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Erreur serveur');
//   }
// });

// // Route pour vérifier que le serveur fonctionne
// app.get('/api/health', (req, res) => {
//   res.send('Le serveur est opérationnel !');
// });

// app.listen(port, () => {
//   console.log(`Serveur en écoute sur le port ${port}`);
// });