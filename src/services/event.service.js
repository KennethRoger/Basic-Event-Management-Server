const { ValidationError, NotFoundError } = require("../utils/appErrors");
const isValidTimezone = require("../utils/isValidTimezone");
const userRepo = require("../repositories/user.repository");
const eventRepo = require("../repositories/event.repository");
const { errorCodeMsg } = require("../constants/errorCodes");
const { isValidObjectId } = require("mongoose");

const createEvent = async ({ creatorId, profiles, timezone, startAt, endAt }) => {
    if (!creatorId || !isValidObjectId(creatorId)) {
        throw new ValidationError('creatorId is missing or invalid!');
    }

    if (!Array.isArray(profiles) || profiles.length === 0) {
        throw new ValidationError('Profiles must be non-empty array!')
    }

    if (!profiles.every(isValidObjectId)) {
        throw new ValidationError('profiles must contain valid user IDs!');
    }

    if (!timezone || !isValidTimezone(timezone)) {
        throw new ValidationError('Timezone must be a valid IANA timezone string!');
    }

    if (!startAt || !endAt || new Date(endAt) <= new Date(startAt)) {
        throw new ValidationError('endAt must be after startAt!');
    }

    const creator = await userRepo.findById(creatorId);
    if (!creator) {
        throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'creatorId does not exist!');
    }

    const foundProfiles = await userRepo.findManyByIds(profiles);
    if (foundProfiles.length !== profiles.length) {
        throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'One or more profile userIds do not exist!');
    }

    return await eventRepo.create({ creatorId, profiles, timezone, startAt, endAt });
}

const getEventsByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
    if (!userId || !isValidObjectId(userId)) {
        throw new ValidationError('userId is required and should be valid!');
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
        throw new ValidationError('page must be a positive number!');
    }

    if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        throw new ValidationError('limit must be between 1 and 100');
    }

    const user = await userRepo.findById(userId);
    if (!user) {
        throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'userId does not exist');
    }

    const [events, totalCount] = await eventRepo.findByUserId(userId, { page: parsedPage, limit: parsedLimit });

    return {
        events,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            totalCount,
            totalPages: Math.ceil(totalCount / parsedLimit)
        }
    }
}

module.exports = {
    createEvent,
    getEventsByUserId
};