const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  }
);

sequelize.authenticate()
  .then(() => console.log('Base de données connectée'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

module.exports = sequelize;
