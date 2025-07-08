const axios = require('axios');
const User = require("../database/userModel");

const register = async (email, password) => {
    try {
        console.log(email, password);
        const newUser = await User.create({
            email: email,
            password: password,
        });
      
        console.log('Użytkownik utworzony:', newUser);
        return { success: true, message: "User registered successfully", data: newUser };
    } catch (error) {
        console.error("Keycloak user registration error:", error.response?.data || error.message);
        return { success: false, message: "User registration failed" };
    }
};

const findUser = async (email) => {
    try {
        const user = await User.findOne({
            where: { email: email },
        });
        if(user) {
            return { message: "user succesfully found", user }
        } else {
            return { message: "user not found", user: null}
        }
    } catch (error) {
        console.log("user not found: ", error);
        return { message: "error while looking for user", user: null }
    }
}

module.exports = {
    register,
    findUser
}