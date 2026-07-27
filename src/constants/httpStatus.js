const HttpStatus = Object.freeze({
    // 1XX - Informational responses

    // 2XX - Successful responses
    OK: 200,
    CREATED: 201,

    // 3XX - Redirection responses

    // 4XX - Client error responses
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,

    // 5XX - Server error responses
    INTERNAL_SERVER_ERROR: 500

});

module.exports = HttpStatus;