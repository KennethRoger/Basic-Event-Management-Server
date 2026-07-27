const express = require('express');
const app = express();
const globalRateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require("./routes");

app.use(globalRateLimiter);

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

module.exports = app;