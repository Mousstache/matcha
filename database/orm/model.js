import { QueryBuilder } from './queryBuilder.js';
import { Schema } from './schema.js';

export class Model {
  static tableName = '';
  static schema = null;
  
  // Initialiser le schéma
  static init(columns) {
    this.schema = new Schema(this.tableName, columns);
    return this.schema;
  }
  
  // Créer une nouvelle instance du QueryBuilder
  static query() {
    if (!this.schema) {
      throw new Error(`Le schéma n'a pas été initialisé pour le modèle ${this.name}`);
    }
    return new QueryBuilder(this.schema);
  }
  
  // Méthodes statiques pour les opérations CRUD
  static async findAll() {
    return this.query().findAll();
  }
  
  static async findById(id) {
    return this.query().findById(id);
  }
  
  static async create(data) {
    return this.query().create(data);
  }
  
  static async update(id, data) {
    return this.query().update(id, data);
  }
  
  static async delete(id) {
    return this.query().delete(id);
  }
  
  // Méthode pour la validation (basique)
  static validate(data) {
    const errors = {};
    
    for (const [column, def] of Object.entries(this.schema.columns)) {
      // Vérifier les champs requis
      if (def.required && (data[column] === undefined || data[column] === null)) {
        errors[column] = `Le champ ${column} est requis`;
      }
      
      // Vérifier les types
      if (data[column] !== undefined && def.type) {
        if (def.type === 'string' && typeof data[column] !== 'string') {
          errors[column] = `Le champ ${column} doit être une chaîne de caractères`;
        }
        if (def.type === 'number' && typeof data[column] !== 'number') {
          errors[column] = `Le champ ${column} doit être un nombre`;
        }
        if (def.type === 'boolean' && typeof data[column] !== 'boolean') {
          errors[column] = `Le champ ${column} doit être un booléen`;
        }
        if (def.type === 'date' && !(data[column] instanceof Date)) {
          errors[column] = `Le champ ${column} doit être une date`;
        }
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}