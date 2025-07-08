const userService = require("../services/userService");
const searchPublisher = require("../services/searchPublisher");

const createUser = async (req, res) => {
    try {
        const { email, username, password, sex } = req.body;
        console.log(req.body, "data from frontend to register");
        const existingUser = await userService.getUserByEmail(email);
    
        if(!existingUser) {
            const user = {email,username,password,sex}
    
            const created = await userService.createUser(user);
            
            if(created) {
                searchPublisher(created);
                res.json({message: "User was created", status: "success", user: created})
            } else {
                res.json({message: "User not created", status: "failed"})
            }
        } else {
            res.json({message: `Can't create user - user ${email} exists`, status: "failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({message: 'Server error while creating user', status: "error"})
    }

}

const getUser = async (req, res) => {
    try {
        console.log(req.headers, "req headers");
        const email = req.headers['email'];
        const user = await userService.getUserByEmail(email);
        res.json(user);
    } catch(error) {
        res.json(null);
    }
    
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.userId;
        const user = await userService.getUser(id);
        console.log(id, "id", user, "user")
        if(user){
            res.json(user);
        } else res.json(null)

    } catch (error) {
        console.log(error);
        res.json(null)
    }
}

const getUserBasicData = async (req, res) => {
    // id username avatar status

    try {
        const userId = req.params.userId;
        console.log(userId, "fetching basic data - userId")
        const data = await userService.getUserBasicData(userId);
        if (!data) {
            return res.status(404).json({ message: "Couldn't get basic user data" });
        }

        return res.json(data);
    } catch(error) {
        console.log(error, "Server Error while fetching basic user data")
        return res.status(500).json({ message: "Server Error while fetching basic user data" });
    }
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserBasicData
}