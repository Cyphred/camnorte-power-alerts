const ScrapeScheduledInterruptions = require("./scheduledInterruptionScraper");

const start = () => {
  setInterval(
    ScrapeScheduledInterruptions,
    process.env.SCHEDULED_INTERRUPTIONS_SCRAPE_INTERVAL
  );
};

module.exports = start;
