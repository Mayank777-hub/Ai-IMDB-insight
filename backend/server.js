const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", require("./routes/user_routes"));
app.use(cors({
  origin: "http://localhost:3000" 
}));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Mongose Server  Connected");
});

app.listen(process.env.PORT, () => {
    console.log("Backend Server Running ...");
});