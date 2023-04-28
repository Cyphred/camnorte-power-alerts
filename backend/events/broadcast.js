const publishToQueue = require("../rabbitmq/publish");
const BotChannels = require("../lib/botChannels");
const ScrapeHistory = require("../models/scrapeHistory");
const ScheduledInterruption = require("../models/interruptions/scheduled");
const EmergencyInterruption = require("../models/interruptions/emergency");

const filterLapsedAnnouncements = (announcements) => {
  const date_now = new Date();

  const valid = [];

  for (const item of announcements) {
    if (date_now < item.end) {
      valid.push(item);
    }
  }

  return valid;
};

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

    let created = await getAnnouncements(log.created);
    let updated = await getAnnouncements(log.updated);

    // Filter useless announcments
    // Those that have already lapsed
    created = filterLapsedAnnouncements(created);
    updated = filterLapsedAnnouncements(updated);

    for (const newAnnouncement of created) {
      newAnnouncement.created = true;
      newAnnouncement.type = "announcement";
      broadcastToAllBots(newAnnouncement);
    }

    for (const updatedAnnouncement of updated) {
      updatedAnnouncement.created = false;
      updatedAnnouncement.type = "announcement";
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
