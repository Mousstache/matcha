import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});



const db = {
  query: async (sql, params = []) => {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  },
  
  findOne: async (table, conditions = {}) => {
    const keys = Object.keys(conditions);
    if (keys.length === 0) return null;
    
    const whereClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
    const values = keys.map(key => conditions[key]);
    
    const sql = `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`;
    const results = await db.query(sql, values);
    
    return results.length > 0 ? results[0] : null;
  },
  
  insert: async (table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await db.query(sql, values);
    
    return result;
  },
  
  update: async (table, data, conditions) => {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    
    const conditionKeys = Object.keys(conditions);
    const conditionValues = Object.values(conditions);
    
    const setClause = dataKeys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
    const whereClause = conditionKeys.map((key, idx) => 
      `${key} = $${idx + 1 + dataKeys.length}`).join(' AND ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const values = [...dataValues, ...conditionValues];
    
    const result = await db.query(sql, values);
    return result;
  },

  delete: async (table, conditions) => {
    const keys = Object.keys(conditions);
    if (keys.length === 0) return null;

    // Construire la clause WHERE dynamiquement
    const whereClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
    const values = keys.map(key => conditions[key]);

    // Requête SQL de suppression avec possibilité de retourner les lignes supprimées
    const sql = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
    
    const result = await db.query(sql, values);
    return result;
  },
};

export default db;
// module.exports = db;

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection à PostgreSQL réussie');
//   } catch (error) {
//     console.error('Erreur de connexion à PostgreSQL:', error);
//     process.exit(1);
//   }
// };

// export { sequelize, connectDB };