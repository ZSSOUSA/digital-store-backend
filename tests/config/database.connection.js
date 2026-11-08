const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeTest = new Sequelize(
  'digital_store_test',
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelizeTest;