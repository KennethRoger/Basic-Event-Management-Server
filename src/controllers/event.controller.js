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

module.exports = {
    createEvent
};