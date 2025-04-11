const subscribeSSE = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendData = () => {
    const mockData = JSON.stringify([{ 
      timestamp: new Date(), 
      ohlc: { open: 100, high: 105, low: 95, close: 98 },
      "index": 102.5,
    "atmStrike": 101,
    "vwap": 100.8 
    }]);
    res.write(`data: ${JSON.stringify([tick])}\n\n`);

  };

  const interval = setInterval(sendData, 2000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

module.exports = { subscribeSSE };
