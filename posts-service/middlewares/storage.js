const multer = require('multer');

const storage = multer.memoryStorage(); // Użyj pamięci, zamiast zapisywać na dysku
const upload = multer({ storage: storage });

module.exports = upload;