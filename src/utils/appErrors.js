const { ERROR_CODES, errorCodeMsg } = require("../constants/errorCodes");

class AppError extends Error {
    constructor(codeMsg, details) {
        const statusCode = ERROR_CODES[codeMsg];
        if (!statusCode) throw new Error(`Invalid errorCodeMsg recieved: ${codeMsg}`);

        super(details)
        this.statusCode = statusCode;
        this.codeMsg = codeMsg;
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(codeMsg, details) {
        super(codeMsg, details);
    }
}

class ValidationError extends AppError {
    constructor(details) {
        super(errorCodeMsg.VALIDATION_ERROR, details);
    }
}

class ConflictError extends AppError {
    constructor(codeMsg, details) {
        super(codeMsg, details);
    }
}


module.exports = { 
    AppError,
    NotFoundError,
    ValidationError,
    ConflictError
}