const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Błąd hashowania:', error);
    }
}

async function comparePassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Błąd porównywania haseł:', error);
    }
}
  
module.exports = {
    hashPassword,
    comparePassword
}