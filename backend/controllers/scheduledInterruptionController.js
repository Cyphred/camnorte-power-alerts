const ScheduledInterruption = require("../models/interruptions/scheduled");

const getAllScheduledInterruptions = async (req, res) => {
  try {
    const announcements = await ScheduledInterruption.find({});
    return res.status(200).json(announcements);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllScheduledInterruptions };
