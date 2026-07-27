const { ValidationError, NotFoundError } = require("../utils/appErrors");
const isValidTimezone = require("../utils/isValidTimezone");
const userRepo = require("../repositories/user.repository");
const eventRepo = require("../repositories/event.repository");
const eventLogRepo = require("../repositories/eventLog.repository");
const { errorCodeMsg } = require("../constants/errorCodes");
const mongoose = require("mongoose");

const createEvent = async ({ creatorId, profiles, timezone, startAt, endAt }) => {
    if (!creatorId || !mongoose.isValidObjectId(creatorId)) {
        throw new ValidationError('creatorId is missing or invalid!');
    }

    if (!Array.isArray(profiles) || profiles.length === 0) {
        throw new ValidationError('Profiles must be non-empty array!')
    }

    if (!profiles.every(mongoose.isValidObjectId)) {
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
    if (!userId || !mongoose.isValidObjectId(userId)) {
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

const diffProfiles = (previousProfiles, nextProfiles) => {
    const prevSet = new Set(previousProfiles.map(String));
    const nextSet = new Set(nextProfiles.map(String));
    return {
        added: [...nextSet].filter((id) => !prevSet.has(id)),
        removed: [...prevSet].filter((id) => !nextSet.has(id)),
    };
};

const buildChangeLog = (existingEvent, updates) => {
    const changes = {};

    if (updates.profiles) {
        const { added, removed } = diffProfiles(existingEvent.profiles, updates.profiles);
        if (added.length || removed.length) changes.profiles = { added, removed };
    }
    if (updates.timezone && updates.timezone !== existingEvent.timezone) {
        changes.timezone = { previous: existingEvent.timezone, current: updates.timezone };
    }
    if (updates.startAt && new Date(updates.startAt).getTime() !== existingEvent.startAt.getTime()) {
        changes.startAt = { previous: existingEvent.startAt, current: updates.startAt };
    }
    if (updates.endAt && new Date(updates.endAt).getTime() !== existingEvent.endAt.getTime()) {
        changes.endAt = { previous: existingEvent.endAt, current: updates.endAt };
    }

    return changes;
};

const updateEvent = async (eventId, updatedBy, updates) => {
    const eventFields = ["profiles", "timezone", "startAt", "endAt"];
    const fields = eventFields.filter((val) => updates[val] != null);

    if (fields.length === 0) {
        throw new ValidationError("At least one field must be provided for update and they can't be null!");
    }

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
        throw new ValidationError("eventId can't be empty or invalid!");
    }

    const existingEvent = await eventRepo.findById(eventId);
    if (!existingEvent) {
        throw new NotFoundError(errorCodeMsg.EVENT_NOT_FOUND, `Event with id: ${eventId} does not exist`)
    }

    if (updates.profiles) {
        if (!Array.isArray(updates.profiles) || updates.profiles.length === 0) {
            throw new ValidationError("Profile is an array and it can't be empty!");
        }

        const foundProfiles = await userRepo.findManyByIds(updates.profiles);
        if (foundProfiles.length !== updates.profiles.length) {
            throw new NotFoundError(errorCodeMsg.USER_NOT_FOUND, 'One or more profile userIds do not exist');
        }
    }

    if (updates.timezone && !isValidTimezone(updates.timezone)) {
        throw new ValidationError('Timezone must be a valid IANA timezone string!');
    }

    const startAt = updates.startAt ?? existingEvent.startAt;
    const endAt = updates.endAt ?? existingEvent.endAt;
    if (new Date(endAt) <= new Date(startAt)) {
        throw new ValidationError('endAt must be after startAt!');
    }

    const changes = buildChangeLog(existingEvent, updates);
    const updatedEvent = await eventRepo.updateById(eventId, updates);

    if (Object.keys(changes).length > 0) {
        await eventLogRepo.create({ eventId, updatedBy, action: "UPDATE", changes });
    }

    return updatedEvent;
}

const getEventLogs = async (eventId, { limit = 10, cursor }) => {
    if (!eventId || !mongoose.isValidObjectId(eventId)) {
        throw new ValidationError("eventId can't be empty or invalid!");
    }

    const parsedLimit = Number(limit);
    if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        throw new ValidationError('limit must be between 1 and 100');
    }

    const existingEvent = await eventRepo.findById(eventId);
    if (!existingEvent) {
        throw new NotFoundError(errorCodeMsg.EVENT_NOT_FOUND, 'eventId does not exist');
    }

    const results = await eventLogRepo.findByEventId(eventId, { limit: parsedLimit, cursor });

    const hasMore = results.length > parsedLimit;
    const logs = hasMore ? results.slice(0, parsedLimit) : results;
    const nextCursor = hasMore ? logs[logs.length - 1].createdAt.toISOString() : null;

    return {
        logs,
        pagination: { limit: parsedLimit, nextCursor, hasMore }
    }
}

module.exports = {
    createEvent,
    getEventsByUserId,
    updateEvent,
    getEventLogs
};