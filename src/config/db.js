const mongoose = require("mongoose");
const logger = require("../utils/logger");
const env = require("./env");

const connectDB = async () => {
    try {

        mongoose.connection.on('connected', () => {
            logger.info(`Mongoose connected successfully to ${mongoose.connection.name}`);
        })

        mongoose.connection.on('error', (err) => {
            logger.error(`Mongoose connection error: ${err}`);
        })

        mongoose.connection.on("disconnected", () => {
            logger.info(`Connection to ${mongoose.connection.name} terminated!`);
        })

        await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 10000
        });
    } catch (err) {
        logger.error(`Mongoose connection failed: ${err}`);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info(`Mongoose connection closed (SIGINT)`);
});

module.exports = connectDB;