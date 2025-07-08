const getMinimumUserData = async (userId) => {
    try {
        const response = await fetch(`${process.env.USER_SERVICE_URL}/${userId}/basic-data`, {
            method: "GET",
        });
        console.log("getMinimumUserData userID: ", userId);
        if(response.ok){
            return await response.json();
        } else return null;
    } catch (error) {
        console.log("Error fetching minimum user data: ", error);
    }

}

module.exports = {
    getMinimumUserData
}