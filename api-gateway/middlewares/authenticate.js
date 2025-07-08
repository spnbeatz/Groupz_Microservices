const axios = require('axios');

async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log("❌ Brak tokenu");
            return res.status(401).json({ message: "Unauthorized: Token missing" });
        }

        // 🔹 1. Weryfikacja tokena w user-service
        const userResponse = await fetch(`${process.env.AUTH_SERVICE_URL}/authorize`, {
            method: "GET",
            headers: { Authorization: token }
        });

        // Sprawdzenie, czy serwis uwierzytelniający zwrócił poprawną odpowiedź
        if (!userResponse.ok) {
            console.log(`❌ Błąd autoryzacji: ${userResponse.status}`);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const data = await userResponse.json();

        // Sprawdzenie, czy `data.user.user` zawiera poprawne dane
        if (!data?.user?.user?.id || !data?.user?.user?.email) {
            console.log("❌ Niepoprawny format użytkownika:", data);
            return res.status(401).json({ message: "Unauthorized: Invalid user data" });
        }

        // 🔹 2. Przypisanie danych użytkownika do `req.user`
        req.user = {
            id: data.user.user.id,
            email: data.user.user.email
        };

        console.log("✅ Autoryzacja udana:", req.user);

        // 🔹 3. Dodanie `user-id` i `authorization` do nagłówków
        req.headers["user-id"] = String(req.user.id);
        req.headers["email"] = req.user.email;

        next();
    } catch (error) {
        console.error("❌ Błąd autoryzacji:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = authenticate;


module.exports = { authenticate }