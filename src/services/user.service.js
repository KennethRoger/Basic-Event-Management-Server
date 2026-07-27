const { ValidationError, ConflictError } = require("../utils/appErrors")
const userRepo = require("../repositories/user.repository");
const { errorCodeMsg } = require("../constants/errorCodes");

const createUser = async (username) => {
    if (!username || typeof(username) !== 'string' || !username.trim()) {
        throw new ValidationError('username is required')
    }

    const existingUser = await userRepo.findByUsername(username);
    if (existingUser) {
        throw new ConflictError(errorCodeMsg.USERNAME_TAKEN, "Username already exists!");
    }

    const user = await userRepo.create(username.trim());
    return user;
}

const searchUsers = async (query, limit) => {
    if (!query || typeof(query) !== 'string' || !query.trim()) {
        throw new ValidationError('query string is required');
    }

    const parsedLimit = limit ? Number(limit) : 5;
    if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 10) {
        throw new ValidationError(`Limit must be between 1 and 10`);
    } 

    return await userRepo.searchByUsername(query.trim(), parsedLimit);
}

module.exports = {
    createUser,
    searchUsers
}