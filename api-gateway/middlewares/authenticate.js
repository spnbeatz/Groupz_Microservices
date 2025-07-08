const axios = require('axios');

async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log("❌ Brak tokenu");
            return res.status(401).json({ message: "Unauthorized: Token missing" });
        }

        const userResponse = await fetch(`${process.env.AUTH_SERVICE_URL}/authorize`, {
            method: "GET",
            headers: { Authorization: token }
        });

        if (!userResponse.ok) {
            console.log(`Błąd autoryzacji: ${userResponse.status}`);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const data = await userResponse.json();

        if (!data?.user?.user?.id || !data?.user?.user?.email) {
            console.log("Niepoprawny format użytkownika:", data);
            return res.status(401).json({ message: "Unauthorized: Invalid user data" });
        }

        req.user = {
            id: data.user.user.id,
            email: data.user.user.email
        };

        console.log("Autoryzacja udana:", req.user);
        req.headers["user-id"] = String(req.user.id);
        req.headers["email"] = req.user.email;

        next();
    } catch (error) {
        console.error("Błąd autoryzacji:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = authenticate;


module.exports = { authenticate }