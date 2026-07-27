const HttpStatus = require("../constants/httpStatus");
const userService = require("../services/user.service");
const { success } = require("../utils/response");

const createUser = async (req, res, next) => {
    const { username } = req.body;  
    
    try {
    const user = await userService.createUser(username);

    res.status(HttpStatus.CREATED).json(success('User created successfully', user));
    } catch (err) {
        next(err);
    }   
}

const searchUsers = async (req, res, next) => {
    const { str, limit } = req.query;

    try {
        const users = await userService.searchUsers(str, limit);

        res.status(HttpStatus.OK).json(success('Users retrieved', users))
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createUser,
    searchUsers
}