const httpStatus = require('./httpStatus');

const ERROR_CODES = Object.freeze({
    USER_NOT_FOUND: httpStatus.NOT_FOUND,
    SERVER_ERROR: httpStatus.INTERNAL_SERVER_ERROR,
    VALIDATION_ERROR: httpStatus.BAD_REQUEST,
    RATE_LIMITED: httpStatus.TOO_MANY_REQUESTS,
    USERNAME_TAKEN: httpStatus.CONFLICT
})

// const errorCodeMsg = Object.keys(ERROR_CODES).reduce((acc, curr) => {
//     acc[curr] = curr;
//     return acc;
// }, {})

const errorCodeMsg = Object.freeze({
    USER_NOT_FOUND: "USER_NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RATE_LIMITED: "RATE_LIMITED",
    USERNAME_TAKEN: "USERNAME_TAKEN"
})

const codesKeys = Object.keys(ERROR_CODES).sort();
const msgKeys = Object.keys(errorCodeMsg).sort();
if (JSON.stringify(codesKeys) !== JSON.stringify(msgKeys)) {
    throw new Error('CAUTION: Some entries are missing from either ERROR_CODES or errorCodeMsg');
}

module.exports = { ERROR_CODES, errorCodeMsg };