const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/groups";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Połączono z MongoDB"))
  .catch((err) => console.error("Błąd połączenia z MongoDB:", err));

  module.exports = mongoose;

