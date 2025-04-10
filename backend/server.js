const express = require("express");
const cors = require("cors");
require("dotenv").config();

const stockRoutes = require("./routes/stockRoutes");

const app = express();
app.use(cors());
app.use("/api/stocks", stockRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
