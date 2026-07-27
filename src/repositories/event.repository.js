const Event = require("../models/event.model");

const create = (eventData) => Event.create(eventData);
const findById = (eventId) => Event.findById(eventId).lean();

const findByUserId = (userId, { page, limit }) => {
    const skip = (page - 1) * limit;
    return Promise.all([
        Event.find({ profiles: userId }).sort({ startAt: -1 }).skip(skip).limit(limit).lean(),
        Event.countDocuments({ profiles: userId })
    ])
}

const updateById = (eventId, updates) =>
    Event.findByIdAndUpdate(eventId, updates, { returnDocument: 'after', runValidators: true }).lean();

module.exports = {
    create,
    findById,
    findByUserId,
    updateById
};