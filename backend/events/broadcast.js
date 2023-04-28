const publishToQueue = require("../rabbitmq/publish");
const BotChannels = require("../lib/botChannels");
const ScrapeHistory = require("../models/scrapeHistory");
const ScheduledInterruption = require("../models/interruptions/scheduled");
const EmergencyInterruption = require("../models/interruptions/emergency");

const broadcastToAllBots = async (payload) => {
  publishToQueue(BotChannels.TWITTER_PUBLISH, payload);
};

const broadcastLoggedAnnouncements = async (log_id) => {
  // Make sure the log_id is a string
  log_id = log_id.toString();

  try {
    const log = await ScrapeHistory.findOne({ _id: log_id });

    if (!log) {
      throw Error(
        "Could not broadcast logged announcements: Entry does not exist"
      );
    }

    const created = await getAnnouncements(log.created);
    const updated = await getAnnouncements(log.updated);

    for (const newAnnouncement of created) {
      newAnnouncement.new = true;
      broadcastToAllBots(newAnnouncement);
    }

    for (const updatedAnnouncement of updated) {
      newAnnouncement.new = false;
      broadcastToAllBots(updatedAnnouncement);
    }
  } catch (err) {
    console.error(err);
    return;
  }
};

const getAnnouncements = async (articles) => {
  const result = [];

  for (const article of articles) {
    // Determine what collection the article belongs to
    let model;
    switch (article.refType) {
      case "EmergencyInterruption":
        model = EmergencyInterruption;
        break;
      case "ScheduledInterruption":
        model = ScheduledInterruption;
        break;
    }

    const data = await model.findById(article.refId);
    result.push(data.toJSON());
  }

  return result;
};

module.exports = { broadcastLoggedAnnouncements };
