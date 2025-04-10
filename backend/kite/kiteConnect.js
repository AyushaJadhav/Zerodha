const { KiteConnect } = require("kiteconnect");
require("dotenv").config();

const kc = new KiteConnect({
  api_key: process.env.KITE_API_KEY
});

kc.setAccessToken(process.env.KITE_ACCESS_TOKEN);

module.exports = kc;
