const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScrapeHistorySchema = new Schema({
  initiated_at: {
    type: Date,
    required: true,
  },
  total_ms: {
    type: Number,
    required: true,
  },
  created: {
    type: [String],
  },
  updated: {
    type: [String],
  },
});

module.exports = mongoose.model("ScrapeHistory", ScrapeHistorySchema);
