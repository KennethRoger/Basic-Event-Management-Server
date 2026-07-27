const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/", eventController.createEvent);
router.get("/", eventController.getEventsByUserId);

module.exports = router;