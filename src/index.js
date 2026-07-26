const express = require('express');
const app = express();

const envs = require("./config/env");

const PORT = envs.port;

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
});