import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-luxon';
import ChartStreaming from 'chartjs-plugin-streaming';
import { useSelector } from "react-redux";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  ChartStreaming
);
import { useWebSocketContext } from "../../../contexts/WebSocketContext";

const SpeedChartComponent = ({ resource }) => {
  const chartRef = useRef(null)
  const resourceUpdate = useSelector(state => state.resources.resources_data[resource])
  const { watchResource } = useWebSocketContext()

  const data = useRef({
    datasets: [
      { 
        label: "Speed (MPH)",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        pointRadius: 0,
      },
    ],
  });

  const options = useRef({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 5000, // Show last 10 seconds
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Speed (MPH)",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Live Speed Chart (MPH)",
      },
    },
  });

  useEffect(() => {
    watchResource(resource)
  }, [])

  useEffect(() => {
    if (resourceUpdate?.value != null && resourceUpdate?.date && chartRef.current) {
      const dataset = chartRef.current.data.datasets[0];
      dataset.data.push({ x: resourceUpdate.date, y: resourceUpdate.value });
      chartRef.current.update("none");
    }
  }, [resourceUpdate])

  return (
    <div className="w-full h-full">
      <Line data={data.current} options={options.current} ref={chartRef} />
    </div>
  );
};

export default SpeedChartComponent;
