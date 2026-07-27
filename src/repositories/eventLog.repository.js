const EventLog = require('../models/eventLog.model');

const create = (logEntry) => EventLog.create(logEntry);

const findByEventId = (eventId, { limit, cursor }) => {
    const filter = cursor ? { eventId, createdAt: { $lt: new Date(cursor) } } : { eventId };
    return EventLog.find(filter).sort({ createdAt: -1 }).limit(limit + 1).lean();
}

module.exports = {
    create,
    findByEventId
};
