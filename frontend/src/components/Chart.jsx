import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = () => {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/ticks`
    );

    eventSource.onmessage = (e) => {
      const tick = JSON.parse(e.data)[0];
      const time = new Date(tick.timestamp).getTime();

      setSeries((prev) => {
        const newData = [...prev[0].data];
        newData.push({
          x: time,
          y: [
            tick.ohlc.open,
            tick.ohlc.high,
            tick.ohlc.low,
            tick.ohlc.close,
          ],
        });
        return [{ data: newData.slice(-30) }]; // keep last 30 candles
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Live Candlestick (Zerodha WebSocket)",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="candlestick"
      height={350}
    />
  );
};

export default Chart;
