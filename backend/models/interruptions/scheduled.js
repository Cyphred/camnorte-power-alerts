const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArchivedContentSchema = new Schema(
  {
    date_posted: { type: Date },
    title: { type: String },
    content: { type: String },
    content_hash: { type: String },
    images: { type: [String] },
    affected_municipalities: { type: [String] },
    start: { type: Date },
    end: { type: Date },
  },
  { timestamps: true }
);

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
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    history: {
      type: [ArchivedContentSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ScheduledInterruption",
  ScheduledInterruptionSchema
);
