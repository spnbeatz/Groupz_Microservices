const { User } = require("../database/models/userModel")

const getUserByEmail = async (email) => {
    try {
        console.log("get user by email - email: ", email)
        const user = await User.findOne({email});
        console.log("fetched user", user);
        if(user){
            return user;
        } else return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createUser = async (user) => {
    try {
        console.log(process.env.AUTH_SERVICE_URL, "environment - auth service url");
        const response = await fetch(`${process.env.AUTH_SERVICE_URL}/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json(); // Pobranie ID użytkownika
        console.log(data, "fetched data from auth service register");
        // Tworzymy nowy obiekt użytkownika bez hasła
        const { password, ...userWithoutPassword } = { userId: data.data.id, ...user };

        // Zapis do bazy danych
        const newUser = await User.create(userWithoutPassword);
        
        return newUser;
    } catch (error) {
        console.error("Błąd podczas tworzenia użytkownika:", error);
        return null;
    }
};


const getUser = async (id) => {
    try {
        const user = await User.findOne({_id: id});

        return user;


    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserBasicData = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId }) // Szukamy użytkownika po userId
        .select("_id username avatar status") // Wybieramy tylko potrzebne pola
        .lean();

        if(!user) return null

        return user;
    } catch (error) {
        console.log(error, "error while looking for user");
        return null
    }
}


module.exports = {
    getUserByEmail,
    createUser,
    getUser,
    getUserBasicData
}