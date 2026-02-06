const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'product_images',
  timestamps: false,
  underscored: true,
});

module.exports = ProductImage;
