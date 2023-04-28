const express = require("express");

const { sendTweet } = require("../controllers/dev");

const router = express.Router();

router.post("/tweet", sendTweet);

module.exports = router;
