const db = require("./db");

class BaseModel {
    static tableName = "";
    static fields = {};

    constructor(data) {
        Object.assign(this, data);
    }

    static async createTable() {
        const columns = Object.entries(this.fields)
            .map(([name, type]) => `${name} ${type}`)
            .join(", ");
        const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id SERIAL PRIMARY KEY, ${columns})`;

        await db.query(query);
        console.log(`Table ${this.tableName} créée.`);
    }

    async save() {
        const keys = Object.keys(this.constructor.fields);
        const values = keys.map((key) => this[key]);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

        const query = `INSERT INTO ${this.constructor.tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;

        const result = await db.query(query, values);
        Object.assign(this, result.rows[0]);
        return this;
    }

    static async all() {
        const result = await db.query(`SELECT * FROM ${this.tableName}`);
        return result.rows.map((row) => new this(row));
    }

    static async get(where) {
        const keys = Object.keys(where);
        const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
        const values = Object.values(where);

        const query = `SELECT * FROM ${this.tableName} WHERE ${conditions} LIMIT 1`;
        const result = await db.query(query, values);
        return result.rows[0] ? new this(result.rows[0]) : null;
    }

    async update(data) {
        const keys = Object.keys(data);
        const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const values = [...Object.values(data), this.id];

        const query = `UPDATE ${this.constructor.tableName} SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`;
        const result = await db.query(query, values);

        Object.assign(this, result.rows[0]);
        return this;
    }

    async delete() {
        const query = `DELETE FROM ${this.constructor.tableName} WHERE id = $1`;
        await db.query(query, [this.id]);
        return true;
    }
}

module.exports = BaseModel;