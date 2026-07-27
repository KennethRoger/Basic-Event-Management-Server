const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/", eventController.createEvent);
router.get("/", eventController.getEventsByUserId);
router.patch("/:eventId", eventController.updateEvent);
router.get('/:eventId/logs', eventController.getEventLogs);

module.exports = router;