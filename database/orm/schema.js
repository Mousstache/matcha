export class Schema {
    constructor(tableName, columns) {
      this.tableName = tableName;
      this.columns = columns;
      this.primaryKey = 'id';
      this.relations = {};
    }
  
    // Définir une clé primaire personnalisée
    setPrimaryKey(column) {
      this.primaryKey = column;
      return this;
    }
  
    // Ajouter une relation hasMany
    hasMany(model, foreignKey) {
      this.relations[model.toLowerCase()] = {
        type: 'hasMany',
        model,
        foreignKey
      };
      return this;
    }
  
    // Ajouter une relation belongsTo
    belongsTo(model, foreignKey) {
      this.relations[model.toLowerCase()] = {
        type: 'belongsTo',
        model,
        foreignKey
      };
      return this;
    }
  
    // Obtenir la définition de colonne
    getColumnDefinition(columnName) {
      return this.columns[columnName];
    }
  
    // Vérifier si une colonne existe
    hasColumn(columnName) {
      return Object.keys(this.columns).includes(columnName);
    }
  }