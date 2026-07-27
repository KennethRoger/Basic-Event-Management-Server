const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const eventRoutes = require("../routes/event.routes");

router.use("/users", userRoutes)
router.use("/events", eventRoutes);

module.exports = router;