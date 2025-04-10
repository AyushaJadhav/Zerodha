const express = require("express");
const router = express.Router();
const kc = require("../kite/kiteConnect");

router.get("/candlestick", async (req, res) => {
  const { symbol, interval = "day" } = req.query;

  try {
    const data = await kc.getHistoricalData(
      "NSE:" + symbol,
      "day",
      "2024-01-01",
      new Date().toISOString().slice(0, 10),
      false
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
