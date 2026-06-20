const Event = require("../models/schema");

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSess = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          eventCount: { $sum: 1 }
        }
      }
    ]);
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const Userevent_track = async (req, res) => {
  try {
    const events = await Event.find({ session_id: req.params.sessionId })
      .sort({ timestamp: 1 });       
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Heatdata = async (req, res) => {
  try {
    const clicks = await Event.find({
      page_url: req.query.pageUrl,
      event_type: "click"
    }).select("x y"); 
    
    res.status(200).json(clicks);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createEvent ,getAllSess,Userevent_track,Heatdata};