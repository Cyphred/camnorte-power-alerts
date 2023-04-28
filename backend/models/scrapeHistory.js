const mongoose = require("mongoose");
const GenericInterruptionSchema = require("./schemas/genericInterruptionSchema");

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
    type: [GenericInterruptionSchema],
  },
  updated: {
    type: [GenericInterruptionSchema],
  },
});

module.exports = mongoose.model("ScrapeHistory", ScrapeHistorySchema);
