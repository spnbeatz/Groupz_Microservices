// sync.js
const sequelize = require('./connect');
const User = require('./userModel');

sequelize.sync({ force: true })  // force: true usunie i ponownie utworzy tabele
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error syncing the database: ", err);
  });
