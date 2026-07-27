const { ValidationError, NotFoundError } = require("../utils/appErrors");
const isValidTimezone = require("../utils/isValidTimezone");
const userRepo = require("../repositories/user.repository");
const eventRepo = require("../repositories/event.repository");
const { errorCodeMsg } = require("../constants/errorCodes");

const createEvent = async ({ creatorId, profiles, timezone, startAt, endAt }) => {
    if (!creatorId) {
        throw new ValidationError('creatorId is missing!');
    }

    if (!Array.isArray(profiles) || profiles.length === 0) {
        throw new ValidationError('Profiles must be non-empty array')
    }

    if (!timezone || !isValidTimezone(timezone)) {
        throw new ValidationError('Timezone must be a valid IANA timezone string');
    }

    if (!startAt || !endAt || new Date(endAt) <= new Date(startAt)) {
        throw new ValidationError('endAt must be after startAt');
    }

    const creator = await userRepo.findById(creatorId);
    if (!creator) {
        throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'creatorId does not exist');
    }

    const foundProfiles = await userRepo.findManyByIds(profiles);
    if (foundProfiles.length !== profiles.length) {
        throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'One or more profile userIds do not exist');
    }

    return await eventRepo.create({ creatorId, profiles, timezone, startAt, endAt });
}

module.exports = {
    createEvent
};