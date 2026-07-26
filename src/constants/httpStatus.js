const HttpStatus = Object.freeze({
    // 1XX - Informational responses

    // 2XX - Successful responses
    OK: 200,

    // 3XX - Redirection responses

    // 4XX - Client error responses
    NOT_FOUND: 404,

    // 5XX - Server error responses
    INTERNAL_SERVER_ERROR: 500

});

module.exports = HttpStatus;