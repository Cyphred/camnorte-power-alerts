const publishToQueue = require("../rabbitmq/publish");
const BotChannels = require("../lib/botChannels");

const broadcastToAllBots = async (payload) => {
  publishToQueue(BotChannels.TWITTER_PUBLISH, payload);
};

module.exports = { broadcastToAllBots };
