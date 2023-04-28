const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenericInterruptionSchema = new Schema({
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

module.exports = GenericInterruptionSchema;
