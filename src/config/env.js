require('dotenv').config();
const logger = require("../utils/logger");

function validateEnvs() {
    const requiredVars = [
        "PORT",
        "MONGO_URI"
    ];

    const missingVars = requiredVars.filter((val) => !process.env[val]);

    if (missingVars.length > 0) {
        logger.error(`Missing some required env variables: ${missingVars.join(" ")}`);
        process.exit(1);
    }
}

validateEnvs();

const env = Object.freeze({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI
})

module.exports = env;