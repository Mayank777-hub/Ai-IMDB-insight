const mongoose = require("mongoose");

const UserEventSchema = new mongoose.Schema({
 session_id: { 
    type: String, 
    required: true 
  },
  country: { type: String, default: "Unknown" },
  state: { type: String, default: "Unknown" },
  event_type: { 
    type: String, enum: [ "page_view",  "click",  "scroll",  "search",  "form_submit",  "add_to_cart",  "custom"], 
    required: true 
  },
  page_url: { 
    type: String,  required: true  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  
  x: Number,
  y: Number,
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model("Event", UserEventSchema);