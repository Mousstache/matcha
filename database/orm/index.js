// src/db/index.js
import pg from 'pg';
const { Pool } = pg;

// Configuration de la connexion
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ma_base_de_donnees',
  password: process.env.DB_PASSWORD || 'mot_de_passe',
  port: process.env.DB_PORT || 5432,
});

// Fonction utilitaire pour exécuter des requêtes
export const query = async (text, params = []) => {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Exécution de la requête', { text, duration, rowCount: result.rowCount });
    return result;
  } catch (error) {
    console.error('Erreur dans la requête:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Tester la connexion
export const testConnection = async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('Connexion à la base de données réussie:', res.rows[0]);
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return false;
  }
};