const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true, minLength: 1 }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
)

module.exports = mongoose.model('User', userSchema);