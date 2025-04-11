import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = () => {
  const [series, setSeries] = useState([
    { name: "Candles", type: "candlestick", data: [] },
    { name: "Index", type: "line", data: [] },
    { name: "ATM Strike", type: "line", data: [] },
    { name: "VWAP", type: "line", data: [] },
  ]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/ticks`
    );

    eventSource.onmessage = (e) => {
      const tick = JSON.parse(e.data)[0];
      const time = new Date(tick.timestamp).getTime();
      console.log("Received tick:", tick);

      tick.index = tick.index ?? 100 + Math.random();
      tick.atmStrike = tick.atmStrike ?? 100 + Math.random();
      tick.vwap = tick.vwap ?? 100 + Math.random();


      setSeries((prev) => {
        const candles = [...prev[0].data];
        const indexLine = [...prev[1].data];
        const atmLine = [...prev[2].data];
        const vwapLine = [...prev[3].data];

        candles.push({
          x: time,
          y: [
            tick.ohlc.open,
            tick.ohlc.high,
            tick.ohlc.low,
            tick.ohlc.close,
          ],
        });

        indexLine.push({ x: time, y: tick.index });
        atmLine.push({ x: time, y: tick.atmStrike });
        vwapLine.push({ x: time, y: tick.vwap });

        return [
          { name: "Candles", type: "candlestick", data: candles.slice(-30) },
          { name: "Index", type: "line", data: indexLine.slice(-30) },
          { name: "ATM Strike", type: "line", data: atmLine.slice(-30) },
          { name: "VWAP", type: "line", data: vwapLine.slice(-30) },
        ];
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const options = {
    chart: {
      type: "line", 
      height: 350,
      toolbar: { show: true },
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: { speed: 500 },
      },
    },
    tooltip: {
      shared: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        if (seriesIndex === 0) {
          const ohlc = w.globals.initialSeries[0].data[dataPointIndex].y;
          return `
            <div style="color: #4B4B4B; padding: 6px; background: #fff; border-radius: 4px;">
              <div><strong>Open:</strong> ${ohlc[0]}</div>
              <div><strong>High:</strong> ${ohlc[1]}</div>
              <div><strong>Low:</strong> ${ohlc[2]}</div>
              <div><strong>Close:</strong> ${ohlc[3]}</div>
            </div>
          `;
        }
        return false;
      },
    },
    xaxis: {
      type: "datetime",
    },
    stroke: {
      width: [1, 2, 2, 2], 
      curve: "smooth",
    },
    colors: ["#008000", "#FFD700", "#00BFFF", "#FF4500"],
    yaxis: {
      tooltip: { enabled: true },
    },
    legend: {
      show: true,
      position: "top",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "190%",
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
      }}
    >
      <div style={{ width: "90%", maxWidth: "900px" }}>
        <h1 style={{ textAlign: "center", color: "#fff", marginBottom: "1rem" }}>
          Zerodha Chart: Candlestick 
        </h1>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default Chart;
