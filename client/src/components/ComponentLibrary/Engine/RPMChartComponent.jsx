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
import { useWebSocketContext } from "../../../contexts/WebSocketContext";

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

const RPMChartComponent = ({ resource }) => {
  const chartRef = useRef(null);
  const resourceUpdate = useSelector(state => state.resources.resources_data[resource]);
  const { watchResource } = useWebSocketContext()

  const data = useRef({
    datasets: [
      {
        label: "Engine RPM",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.3)",
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
          text: "RPM",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Live RPM Chart",
      },
    },
  });

  useEffect(() => {
    if (resourceUpdate?.value != null && resourceUpdate?.date && chartRef.current) {
      const dataset = chartRef.current.data.datasets[0];
      dataset.data.push({ x: resourceUpdate.date, y: resourceUpdate.value });
      chartRef.current.update("none");
    }
  }, [resourceUpdate]);

  useEffect(() => {
    watchResource(resource)
  }, [])

  return (
    <div className="w-full h-full">
      <Line data={data.current} options={options.current} ref={chartRef} />
    </div>
  );
};

export default RPMChartComponent;
