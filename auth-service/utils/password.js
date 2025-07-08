const bcrypt = require('bcryptjs');

// Funkcja do hashowania hasła
async function hashPassword(password) {
    const saltRounds = 10; // Liczba rund generowania soli
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Błąd hashowania:', error);
    }
}

// Funkcja do porównywania hasła z zapisanym hashem
async function comparePassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch; // Zwraca true, jeśli hasło pasuje, false jeśli nie
    } catch (error) {
      console.error('Błąd porównywania haseł:', error);
    }
}
  
module.exports = {
    hashPassword,
    comparePassword
}