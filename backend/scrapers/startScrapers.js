const ScrapeScheduledInterruptions = require("./scheduledInterruptionScraper");

const start = () => {
  // Set intervals for scraping
  setInterval(
    ScrapeScheduledInterruptions,
    process.env.SCHEDULED_INTERRUPTIONS_SCRAPE_INTERVAL
  );

  // Run scrapes on first load
  ScrapeScheduledInterruptions();
};

module.exports = start;
