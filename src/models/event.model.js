const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        profiles: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            required: true,
            validate: { validator: (arr) => arr.length > 0, message: 'Profile must be non empty array' }
        },
        timezone: { type: String, required: true },
        startAt: { type: Date, required: true },
        endAt: {
            type: Date,
            required: true,
            validate: { validator: function (val) { return val > this.startAt; }, message: 'endAt should be greater than startAt' }
        }
    },
    { timestamps: true }
)

eventSchema.index({ profiles: 1 });

module.exports = mongoose.model('Event', eventSchema);