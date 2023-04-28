const publishToQueue = require("../rabbitmq/publish");
const BotChannels = require("../lib/botChannels");

const sendTweet = async (req, res) => {
  const payload = {
    text: req.body.text,
    type: "test",
  };

  const result = await publishToQueue(BotChannels.TWITTER_PUBLISH, payload);

  if (!result) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
};

module.exports = { sendTweet };
