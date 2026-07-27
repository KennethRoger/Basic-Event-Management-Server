const EventLog = require('../models/eventLog.model');

const create = (logEntry) => EventLog.create(logEntry);

module.exports = {
    create
};
