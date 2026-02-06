const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  price_with_discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',


});

module.exports = Product;
