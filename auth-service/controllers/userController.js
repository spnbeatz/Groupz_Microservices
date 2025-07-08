const userService = require("../services/userService");
const tokenUtils = require("../utils/token");
const passwordUtils = require("../utils/password");

const register = async (req, res) => {
    try {
        const { password, email } = req.body;

        const hashedPassword = await passwordUtils.hashPassword(password)
        console.log(password, " password", email, " email");
        const response = await userService.register(email, hashedPassword);

        if(response){
            res.json(response);
        } else {
            res.json(null);
        }

        
      } catch (error) {
        console.error('Error creating user in Keycloak:', error);
        res.json(null);
        throw error;
      }
};

const login = async (req, res) => {
    try {
        console.log(req.body, "req body login")
        const { email, password} = req.body;
        const user = await userService.findUser(email);
        const fetchedUser = user.user?.dataValues;
        if(user){
            const passwordMatch = passwordUtils.comparePassword(password, fetchedUser.password);
            if(passwordMatch){
                const token = tokenUtils.generateJWT(fetchedUser);
                res.json({token});
            } else {
                res.status(401).json({ message: 'Password not match!' });
            }
        } else {
            res.status(401).json({ message: 'User not exists!' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: 'Invalid credentials' });
    }
}

const authorize = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "unauthorized", user: null, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Pobranie samego tokena (po "Bearer ")
        const user = tokenUtils.verifyJWT(token);

        if (!user) {
            return res.status(401).json({ status: "unauthorized", user: null, message: "Invalid token" });
        }

        res.status(200).json({ status: "authorized", user });
    } catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({ status: "error", user: null, message: "Internal server error" });
    }
};
module.exports = {
    register,
    login,
    authorize
}
