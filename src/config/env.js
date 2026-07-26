require('dotenv').config();

function validateEnvs() {
    const requiredVars = [
        "PORT",
        "MONGO_URI"
    ];

    const missingVars = requiredVars.filter((val) => !process.env[val]);

    if (missingVars.length > 0) {
        console.error(`Missing some required env variables: ${missingVars.join(" ")}`);
        process.exit(1);
    }
}

validateEnvs();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI
}

module.exports = env;