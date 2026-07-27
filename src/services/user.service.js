const { ValidationError, ConflictError } = require("../utils/appErrors")
const userRepo = require("../repositories/user.repository");
const { errorCodeMsg } = require("../constants/errorCodes");

const createUser = async (username) => {
    if (!username || typeof(username) !== 'string' || !username.trim()) {
        throw new ValidationError('username is required')
    }

    try {
        const existingUser = await userRepo.findByUsername(username);
        if (existingUser) {
            throw new ConflictError(errorCodeMsg.USERNAME_TAKEN, "Username already exists!");
        }

        const user = await userRepo.create(username.trim());
        return user;
    } catch (err) {
        throw err;
    }
}