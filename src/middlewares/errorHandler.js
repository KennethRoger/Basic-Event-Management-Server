const { errorCodeMsg, ERROR_CODES } = require("../constants/errorCodes");
const HttpStatus = require("../constants/httpStatus");
const { AppError } = require("../utils/appErrors");
const logger = require("../utils/logger");
const { failure } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        logger.warn(`
            AppError: ${req.method} ${req.originalUrl}\n
            ${err.statusCode}:${err.codeMsg}:${err.details}\n
            ${err.stack}
        `);
        return res.status(err.statusCode).json(failure(err.codeMsg, err.message));
    }

    logger.warn(`Unhandled Error: ${req.method} ${req.originalUrl}\n${err.stack || err}`);
    return res.status(ERROR_CODES[errorCodeMsg.SERVER_ERROR]).json(
        failure(errorCodeMsg.SERVER_ERROR, `Unexpected server error has occurred. Please try again after a while`)
    );
}

module.exports = errorHandler;