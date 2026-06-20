const express = require("express");
const router = express.Router();
const { createEvent ,getAllSess,Userevent_track,Heatdata} = require("../controller/events");

router.post("/events", createEvent);
//router.post("/events", createEvent);
router.get("/sessions", getAllSess);
router.get("/sessions/:sessionId", Userevent_track);
router.get("/heatmap", Heatdata);

module.exports = router;