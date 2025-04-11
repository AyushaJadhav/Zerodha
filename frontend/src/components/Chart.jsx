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

    tooltip: {
      theme: 'dark', // ensures it's styled for dark backgrounds
      style: {
        fontSize: '14px',
        fontFamily: undefined
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const o = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[0];
        const h = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[1];
        const l = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[2];
        const c = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[3];
        return `
          <div style="color: #4B4B4B; padding: 6px; background: #fff; border-radius: 4px;">
            <div><strong>Open:</strong> ${o}</div>
            <div><strong>High:</strong> ${h}</div>
            <div><strong>Low:</strong> ${l}</div>
            <div><strong>Close:</strong> ${c}</div>
          </div>
       ` ;
      }
    },
   plotOptions: {
    candlestick: {
      colors: {
        upward: '#008000',   
        downward: '#FF0000'  
      }
    }
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
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      width: "190%", 
      minHeight: "100vh", 
      backgroundColor: "#1e1e1e" // match your dark theme
    }}>
      <div style={{ width: "90%", maxWidth: "900px" }}>
        <h1 style={{ textAlign: "center", color: "#fff", marginBottom: "1rem" }}>
          Zerodha Candlestick Chart
        </h1>
        <ReactApexChart 
          options={options} 
          series={series} 
          type="candlestick" 
          height={350} 
        />
      </div>
    </div>
    
  );
};

export default Chart;
