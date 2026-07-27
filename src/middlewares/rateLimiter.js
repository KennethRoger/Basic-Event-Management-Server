const rateLimit = require("express-rate-limit");
const { ERROR_CODE, errorCodeMsg } = require("../constants/errorCodes");
const { failure } = require("../utils/response")

const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(ERROR_CODE[errorCodeMsg.RATE_LIMITED]).json(failure(errorCodeMsg.RATE_LIMITED, 'Too many requests, try again later'))
    }
})

module.exports = globalRateLimiter;