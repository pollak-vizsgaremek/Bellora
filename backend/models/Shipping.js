import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Shipping = sequelize.define('Shipping', {
  shipping_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'orders',
      key: 'order_id'
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  carrier: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'processing'
  }
}, {
  tableName: 'shipping',
  timestamps: false
});

export default Shipping;
