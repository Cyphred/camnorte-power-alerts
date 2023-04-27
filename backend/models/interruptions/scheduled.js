const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScheduledInterruptionSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    date_posted: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    content_hash: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    affected_municipalities: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ScheduledInterruption",
  ScheduledInterruptionSchema
);
