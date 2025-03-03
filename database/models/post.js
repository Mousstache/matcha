import { Model } from '../orm/model.js';

export class Post extends Model {
  static tableName = 'posts';
}

// Initialiser le schéma
Post.init({
  id: { type: 'number', primary: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  user_id: { type: 'number', required: true },
  created_at: { type: 'date' }
});

// Définir les relations
Post.schema.belongsTo('User', 'user_id');