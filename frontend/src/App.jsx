import React from "react";
import Chart from "./components/Chart";

function App() {
  return (
    <div>
      <h2>Zerodha Candlestick Chart</h2>
      <Chart symbol="INFY" />
    </div>
  );
}

export default App;
