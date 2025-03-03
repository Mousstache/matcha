import { Model } from '../orm/model.js';

export class User extends Model {
  static tableName = 'users';
}

// Initialiser le schéma
User.init({
  id: { type: 'number', primary: true },
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number' },
  created_at: { type: 'date' }
});

// Définir les relations
User.schema.hasMany('Post', 'user_id');