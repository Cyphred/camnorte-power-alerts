const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TweetHistorySchema = new Schema(
  {
    success: {
      type: Boolean,
      required: true,
    },
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
    response: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TweetHistory", TweetHistorySchema);
