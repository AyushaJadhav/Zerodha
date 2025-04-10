const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { subscribeSSE } = require("./kiteTicker");

const app = express();
app.use(cors());

app.get("/api/ticks", subscribeSSE);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
