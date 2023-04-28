const mongoose = require("mongoose");
const GenericInterruptionSchema = require("./schemas/genericInterruptionSchema");
const BotChannels = require("../lib/botChannels");

const channels = [];
for (const key in BotChannels) {
  channels.push(BotChannels[key]);
}

const Schema = mongoose.Schema;

const BroadcastHistorySchema = new Schema(
  {
    items: {
      type: [GenericInterruptionSchema],
    },
    channels: {
      type: [String],
      enum: channels,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BroadcastHistory", BroadcastHistorySchema);
