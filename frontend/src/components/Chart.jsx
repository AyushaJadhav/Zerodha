import React from "react";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const Chart = ({ symbol }) => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stocks/candlestick?symbol=${symbol}`)
      .then((res) => {
        const formatted = res.data.map((item) => ({
          x: new Date(item.date),
          y: [item.open, item.high, item.low, item.close],
        }));
        setSeriesData(formatted);
      });
  }, [symbol]);

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const ohlc = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y;
        return `
          <div style="padding: 10px; background: rgba(255,255,255,0.8); border: 1px solid #ccc;">
            <div style="color: grey;">Open: ${ohlc[0]}</div>
            <div style="color: grey;">High: ${ohlc[1]}</div>
            <div style="color: grey;">Low: ${ohlc[2]}</div>
            <div style="color: grey;">Close: ${ohlc[3]}</div>
          </div>
        `;
      },
    },
    xaxis: {
      type: "datetime",
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={[{ data: seriesData }]} type="candlestick" height={350} />
    </div>
  );
};

export default Chart;
