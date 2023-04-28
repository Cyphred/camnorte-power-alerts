const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AnnouncementReferenceSchema = new Schema({
  refType: {
    type: String,
    enum: ["ScheduledInterruption", "EmergencyInterruption"],
    required: true,
  },
  refId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "refType",
  },
});

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
    type: [AnnouncementReferenceSchema],
  },
  updated: {
    type: [AnnouncementReferenceSchema],
  },
});

module.exports = mongoose.model("ScrapeHistory", ScrapeHistorySchema);
