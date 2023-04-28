const express = require("express");

const {
  getAllScheduledInterruptions,
} = require("../controllers/scheduledInterruptionController");

const router = express.Router();

router.get("/", getAllScheduledInterruptions);

module.exports = router;
