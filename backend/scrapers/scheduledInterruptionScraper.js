const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");
const ScheduledInterruption = require("../models/interruptions/scheduled");
const ScrapeHistory = require("../models/scrapeHistory");
const ExtractMunicipalities = require("../util/extractMunicipalities");
const {
  broadcastToAllBots,
  broadcastLoggedAnnouncements,
} = require("../events/broadcast");

/**
 * Checks if 2 arrays have the same values, regardless of order.
 * @param {Array} array1
 * @param {Array} array2
 * @returns true if both arrays have the same values
 */
const arrayHasSameValues = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (const value of array1) {
    if (!array2.includes(value)) {
      return false;
    }
  }

  return true;
};

/**
 * Checks a page for any article links that are not older than the MAX_AGE
 * defined in the .env file
 * @param {Number} page is the page number to look for links
 * @returns an array of URLs
 */
const getURLsFromPage = async (page) => {
  const links = [];

  try {
    // Get and parse the HTML
    const response = await axios.get(
      `https://canoreco.com.ph/category/patalastas-ng-power-interruption/page/${page}/`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    // Get the current date/time
    const now = new Date();

    // Iterate through each <article> element
    $("article").each((index, element) => {
      // Compute the article's age
      const time_posted = new Date($(element).find("time").attr("datetime"));
      const age = now - time_posted;

      // If article's age meets the criteria, grab the link and push it onto the array
      if (age < process.env.MAX_AGE) {
        const link = $(element).find("h2").find("a").attr("href");
        links.push(link);
      } else {
        return;
      }
    });

    return links;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Grabs article URLs for a specified number of pages starting from 1
 * @param {Number} max_pages is the furthest page that will be scraped
 * @returns an array of URLs if successful. Will return null, otherwise.
 */
const getURLsFromLatestPages = async (max_pages) => {
  const promises = [];

  for (let i = 1; i <= max_pages; i++) {
    promises.push(getURLsFromPage(i));
  }

  try {
    const linksArrays = await Promise.all(promises);
    const links = linksArrays.flat();
    return links;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 * Retrieves and scrapes data from an article page
 * @param {String} url is the URL that will be scraped for article data
 */
const getArticleData = async (url) => {
  const stats = {
    created: false,
    updated: false,
    data: null,
  };

  try {
    // Fetch article from URL and parse it
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract relevant info
    const article = $("main").find("article");

    // Convert any special/styled characters into plain ASCII
    const title = article
      .find("h1")
      .text()
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "");

    // Convert any special/styled characters into plain ASCII
    const content_raw = article.find("div.entry-content").text();
    const content_cleaned = content_raw
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "");

    const date_posted = new Date(article.find("time").attr("datetime"));

    // Get all images in the article content
    const images = [];
    article
      .find("div.entry-content")
      .find("img")
      .each((index, element) => {
        const image = $(element).attr("src");

        if (image) {
          images.push(image);
        }
      });

    // Create a hash of the raw content
    const content_hash = crypto
      .createHash("md5")
      .update(content_raw)
      .digest("hex");

    // Extract municipalities from text
    const affected_municipalities = ExtractMunicipalities(content_cleaned);

    // Check if article exists in the database
    let announcement = await ScheduledInterruption.findOne({ url });

    // Create an entry if it does not exist yet
    if (!announcement) {
      // Declare this article as new
      stats.created = true;

      announcement = await ScheduledInterruption.create({
        url,
        date_posted,
        title,
        content: content_cleaned,
        content_hash,
        images,
        affected_municipalities,
      });
    }
    // Check for changes if an entry already exists
    else {
      if (title !== announcement.title) {
        stats.updated = true;
        console.log("Updating title");
        announcement.title = title;
      }

      if (content_hash !== announcement.content_hash) {
        stats.updated = true;
        console.log("Updating content");
        announcement.content = content_cleaned;
        announcement.content_hash = content_hash;
      }

      if (date_posted.getTime() !== announcement.date_posted.getTime()) {
        stats.updated = true;
        announcement.date_posted = date_posted;
      }

      if (!arrayHasSameValues(images, announcement.images)) {
        stats.updated = true;
        announcement.images = images;
      }

      if (
        !arrayHasSameValues(
          affected_municipalities,
          announcement.affected_municipalities
        )
      ) {
        stats.updated = true;
        announcement.affected_municipalities = affected_municipalities;
      }

      await announcement.save();
    }

    stats.data = announcement.toJSON();
  } catch (error) {
    console.error(error);
    throw error;
  }

  return stats;
};

const saveScrapeHistory = async (data) => {
  const { initiated_at, total_ms, created, updated } = data;

  const prepared = {
    created: [],
    updated: [],
  };

  for (const id of created) {
    prepared.created.push({
      refId: id,
      refType: "ScheduledInterruption",
    });
  }

  for (const id of updated) {
    prepared.updated.push({
      refId: id,
      refType: "ScheduledInterruption",
    });
  }

  try {
    const record = await ScrapeHistory.create({
      initiated_at,
      total_ms,
      ...prepared,
    });

    return record.toJSON();
  } catch (err) {
    console.error(err);
    return;
  }
};

const scrape = async () => {
  try {
    const timestamp = new Date();

    // For measuring how much time it took to scrape everything
    const start = performance.now();

    const links = await getURLsFromLatestPages(3);

    const stats = {
      initiated_at: timestamp,
      total_ms: 0,
      created: [],
      updated: [],
    };

    for (const url of links) {
      const { created, updated, data } = await getArticleData(url);

      if (created) {
        stats.created.push(data._id.toString());
      }

      if (updated) {
        stats.updated.push(data._id.toString());
      }
    }

    // Log the time it finished scraping and saving data
    stats.total_ms = performance.now() - start;

    console.log(stats);

    // If there is at least 1 announcement created or updated
    if (stats.created.length || stats.updated.length) {
      const log = await saveScrapeHistory(stats);
      broadcastLoggedAnnouncements(log._id);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = scrape;
