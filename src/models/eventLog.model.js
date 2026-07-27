const mongoose = require("mongoose");

const profilesChangeSchema = new mongoose.Schema(
    {
        added: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        removed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    { _id: false }
);

const timezoneChangeSchema = new mongoose.Schema(
    {
        previous: String,
        current: String
    },
    { _id: false }
);

const dateChangeSchema = new mongoose.Schema(
    {
        previous: Date,
        current: Date
    },
    { _id: false }
);

const eventChangeSchema = new mongoose.Schema(
    {
        profiles: profilesChangeSchema,
        timezone: timezoneChangeSchema,
        startAt: dateChangeSchema,
        endAt: dateChangeSchema
    },
    { _id: false }
);

const eventLogSchema = new mongoose.Schema(
    {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, enum: ['CREATE', 'UPDATE'], required: true },
        changes: { type: eventChangeSchema }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

eventLogSchema.index({ eventId: 1, createdAt: -1 });

module.exports = mongoose.model('EventLog', eventLogSchema);