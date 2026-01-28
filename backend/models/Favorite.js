import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Favorite = sequelize.define('Favorite', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'items',
      key: 'item_id'
    }
  }
}, {
  tableName: 'favorites',
  timestamps: false
});

export default Favorite;
