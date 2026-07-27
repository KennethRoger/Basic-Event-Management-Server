const HttpStatus = require("../constants/httpStatus");
const eventService = require("../services/event.service");
const { success } = require("../utils/response");

const createEvent = async (req, res, next) => {
    const eventData = req.body;
    try {
        const event = await eventService.createEvent(eventData);
        res.status(HttpStatus.CREATED).json(success('Event created successfully', event))
    } catch (err) {
        next(err);
    }
}

const getEventsByUserId = async (req, res, next) => {
    const { userId, page, limit } = req.query;
    try {
        const paginatedEvents = await eventService.getEventsByUserId(userId, { page, limit });
        res.status(HttpStatus.OK).json(success(`Retrieved events assigned to userId: ${userId}`, paginatedEvents));
    } catch (err) {
        next(err);
    }
}

const updateEvent = async (req, res, next) => {
    const { evenId } = req.params;
    const { updatedBy, ...updates } = req.body;
    try {
        const updatedEvent = await eventService.updateEvent(eventId, updatedBy, updates);
        res.status(HttpStatus.OK).json(success('Event updated successfully', updatedEvent));
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createEvent,
    getEventsByUserId,
    updateEvent
};