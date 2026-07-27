const success = (message, data) => ({
    success: true,
    message,
    data,
    error: null
});

const failure = (codeMsg, details) => ({
    success: false,
    message: details,
    data: null,
    error: { codeMsg, details }
});

module.exports = { success, failure };