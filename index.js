const connectDB = require("./src/config/db");
const app = require("./src/app");

const env = require("./src/config/env");
const logger = require("./src/utils/logger");

const PORT = env.port;
const start = async () => {
    await connectDB();    
    app.listen(PORT, () => {
        logger.info(`Server started listening on port ${PORT}`);
    });
}

start();