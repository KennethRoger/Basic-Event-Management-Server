const httpStatus = require('./httpStatus');

const ERROR_CODES = Object.freeze({
    USER_NOT_FOUND: httpStatus.NOT_FOUND,
    SERVER_ERROR: httpStatus.INTERNAL_SERVER_ERROR
})

const errorCodeMsg = Object.keys(ERROR_CODES).reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
}, {})

module.exports = { ERROR_CODES, ErrorCodeMsg: Object.freeze(errorCodeMsg) };