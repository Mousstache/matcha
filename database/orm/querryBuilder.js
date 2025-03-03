import { query } from './index.js';

export class QueryBuilder {
  constructor(schema) {
    this.schema = schema;
    this.whereConditions = [];
    this.limitValue = null;
    this.offsetValue = null;
    this.orderByColumn = null;
    this.orderDirection = 'ASC';
    this.includeRelations = [];
  }

  // SELECT tout
  async findAll() {
    let queryText = `SELECT * FROM ${this.schema.tableName}`;
    queryText = this._addWhereClause(queryText);
    queryText = this._addOrderByClause(queryText);
    queryText = this._addLimitOffset(queryText);
    
    const result = await query(queryText, this._getParams());
    return this._processRelations(result.rows);
  }

  // SELECT par id
  async findById(id) {
    const queryText = `SELECT * FROM ${this.schema.tableName} WHERE ${this.schema.primaryKey} = $1`;
    const result = await query(queryText, [id]);
    if (result.rows.length === 0) return null;
    
    return this._processRelations(result.rows[0]);
  }

  // INSERT
  async create(data) {
    const columns = Object.keys(data).filter(col => this.schema.hasColumn(col));
    const values = columns.map(col => data[col]);
    
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');
    
    const queryText = `
      INSERT INTO ${this.schema.tableName} (${columnNames})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(queryText, values);
    return result.rows[0];
  }

  // UPDATE
  async update(id, data) {
    const columns = Object.keys(data).filter(col => this.schema.hasColumn(col));
    const values = columns.map(col => data[col]);
    
    const setClause = columns
      .map((col, i) => `${col} = $${i + 1}`)
      .join(', ');
    
    const queryText = `
      UPDATE ${this.schema.tableName}
      SET ${setClause}
      WHERE ${this.schema.primaryKey} = $${values.length + 1}
      RETURNING *
    `;
    
    const result = await query(queryText, [...values, id]);
    return result.rows[0];
  }

  // DELETE
  async delete(id) {
    const queryText = `DELETE FROM ${this.schema.tableName} WHERE ${this.schema.primaryKey} = $1 RETURNING *`;
    const result = await query(queryText, [id]);
    return result.rows[0];
  }

  // WHERE
  where(column, operator, value) {
    if (!this.schema.hasColumn(column)) {
      throw new Error(`La colonne ${column} n'existe pas dans la table ${this.schema.tableName}`);
    }
    this.whereConditions.push({ column, operator, value });
    return this;
  }

  // LIMIT
  limit(value) {
    this.limitValue = value;
    return this;
  }

  // OFFSET
  offset(value) {
    this.offsetValue = value;
    return this;
  }

  // ORDER BY
  orderBy(column, direction = 'ASC') {
    if (!this.schema.hasColumn(column)) {
      throw new Error(`La colonne ${column} n'existe pas dans la table ${this.schema.tableName}`);
    }
    this.orderByColumn = column;
    this.orderDirection = direction;
    return this;
  }

  // Inclure des relations
  include(relationName) {
    if (!this.schema.relations[relationName]) {
      throw new Error(`La relation ${relationName} n'existe pas dans le modèle ${this.schema.tableName}`);
    }
    this.includeRelations.push(relationName);
    return this;
  }

  // Méthodes d'aide privées
  _addWhereClause(queryText) {
    if (this.whereConditions.length === 0) return queryText;
    
    const whereClause = this.whereConditions
      .map((condition, i) => `${condition.column} ${condition.operator} $${i + 1}`)
      .join(' AND ');
    
    return `${queryText} WHERE ${whereClause}`;
  }

  _addOrderByClause(queryText) {
    if (!this.orderByColumn) return queryText;
    return `${queryText} ORDER BY ${this.orderByColumn} ${this.orderDirection}`;
  }

  _addLimitOffset(queryText) {
    let result = queryText;
    if (this.limitValue !== null) {
      result = `${result} LIMIT ${this.limitValue}`;
    }
    if (this.offsetValue !== null) {
      result = `${result} OFFSET ${this.offsetValue}`;
    }
    return result;
  }

  _getParams() {
    return this.whereConditions.map(condition => condition.value);
  }

  // Traitement des relations (à implémenter)
  async _processRelations(data) {
    if (!this.includeRelations.length) return data;
    
    // Si les données sont un tableau
    if (Array.isArray(data)) {
      const result = [...data];
      for (const item of result) {
        await this._loadRelations(item);
      }
      return result;
    }
    
    // Si les données sont un objet unique
    if (data) {
      await this._loadRelations(data);
    }
    return data;
  }

  async _loadRelations(item) {
    for (const relationName of this.includeRelations) {
      const relation = this.schema.relations[relationName];
      
      if (relation.type === 'hasMany') {
        const relatedTable = relation.model.toLowerCase() + 's'; // Pluralize (simple)
        const sql = `
          SELECT * FROM ${relatedTable} 
          WHERE ${relation.foreignKey} = $1
        `;
        const result = await query(sql, [item[this.schema.primaryKey]]);
        item[relationName] = result.rows;
      }
      
      if (relation.type === 'belongsTo') {
        const relatedTable = relation.model.toLowerCase() + 's'; // Pluralize (simple)
        const sql = `
          SELECT * FROM ${relatedTable} 
          WHERE id = $1
        `;
        const result = await query(sql, [item[relation.foreignKey]]);
        item[relationName] = result.rows[0] || null;
      }
    }
  }
}