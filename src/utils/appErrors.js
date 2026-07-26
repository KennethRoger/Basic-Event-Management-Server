const { ERROR_CODES } = require("../constants/errorCodes");

class AppError extends Error {
    constructor(codeMsg, details) {
        const statusCode = ERROR_CODES[codeMsg];
        if (!statusCode) throw new Error(`Invalid ErrorCodeMsg recieved: ${codeMsg}`);

        super(details)
        this.statusCode = statusCode;
        this.codeMsg = codeMsg;
        this.details = details;
    }
}


module.exports = { 
    AppError
}