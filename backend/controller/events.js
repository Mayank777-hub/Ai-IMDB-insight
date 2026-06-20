const Event = require("../models/schema");
const geoip = require("geoip-lite"); // we can use this to find ip address and i use it to get nationality of users
const createEvent = async (req, res) => {
  try {
  
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);

    const Userdata = {
      ...req.body,
      country: geo ? geo.country : "Anonymous",  // :-) may be use vpn
      state: geo ? geo.region : "Unknown"    
    };
      const event = await Event.create(Userdata);
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
    const targetUrl = req.query.pageUrl;
    let queryCondition = { event_type: "click" };

    
    if (targetUrl && targetUrl.includes("/movie")) {
      queryCondition.page_url = { $regex: /\/movie/ };
    } else {
      queryCondition.page_url = targetUrl;
    }

    const clicks = await Event.find(queryCondition).select("x y"); 
    res.status(200).json(clicks);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createEvent ,getAllSess,Userevent_track,Heatdata};