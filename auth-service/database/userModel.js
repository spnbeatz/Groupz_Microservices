// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./connect');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,  // Dodaje pola createdAt i updatedAt
  tableName: 'users', // Opcjonalnie, zmienia nazwę tabeli
});

module.exports = User;
