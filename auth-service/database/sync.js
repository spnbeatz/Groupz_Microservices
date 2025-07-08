// sync.js
const sequelize = require('./connect');
const User = require('./userModel');

sequelize.sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error syncing the database: ", err);
  });
