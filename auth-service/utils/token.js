const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
    console.log(user, "generate token user")
    if (!user?.id || !user?.email) {
        throw new Error("Invalid user object: Missing id or email");
    }

    const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h", algorithm: "HS256" }
    );

    console.log("Generated token:", jwtToken);
    return jwtToken;
};

const verifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        return { valid: true, user: decoded };
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return { valid: false, error: err.message };
    }
};

module.exports = {
    generateJWT,
    verifyJWT
};
