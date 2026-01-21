import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ItemImage = sequelize.define('ItemImage', {
    image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'items',
            key: 'item_id'
        }
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'itemimages',
    timestamps: false
});

export default ItemImage;
