const express = require('express');
const cors = require("cors");
const globalRateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require("./routes");
const env = require("./config/env");
const app = express();

app.use(globalRateLimiter);

app.get("/me", (req, res) => {
    res.send("Server is Up and Running!")
});

app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;