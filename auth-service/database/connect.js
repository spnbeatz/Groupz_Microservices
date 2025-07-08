require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: false, // Wyłącz logowanie SQL (opcjonalne)
  }
);

// Sprawdzenie połączenia z bazą danych
sequelize.authenticate()
  .then(() => {
    console.log('Połączenie z bazą danych zostało nawiązane.');
  })
  .catch((error) => {
    console.error('Nie udało się połączyć z bazą danych:', error);
  });

module.exports = sequelize; // Eksportujemy instancję sequelize
