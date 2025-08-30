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
import "chartjs-adapter-luxon";        // you already installed luxon
import { useSelector } from "react-redux";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Title);

const WINDOW_MS = 10_000;   // show last 10s

const SpeedChartComponent = ({ resource }) => {
  const chartRef = useRef(null);
  const resourceUpdate = useSelector(s => s.resources.resources_data[resource]);
  const { watchResource /*, unwatchResource*/ } = useWebSocketContext();

  const data = useRef({
    datasets: [
      {
        label: "Speed (MPH)",
        data: [], // array of {x: ISO string/ms, y: number}
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
    parsing: false,
    normalized: true,
    scales: {
      x: {
        type: "time",
        time: { unit: "second" },
        ticks: { autoSkip: true, maxTicksLimit: 6 },
        title: { display: true, text: "Time" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Speed (MPH)" },
      },
    },
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Live Speed Chart (MPH)" },
    },
  });

  useEffect(() => {
    watchResource(resource);
    // return () => unwatchResource?.(resource);
  }, [resource, watchResource]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (resourceUpdate?.value == null || !resourceUpdate?.date) return;

    const chart = chartRef.current;               // Chart.js instance (react-chartjs-2 v5 ref)
    const ds = chart.data.datasets[0];
    const now = Date.now();

    // Push the latest point
    ds.data.push({ x: resourceUpdate.date, y: resourceUpdate.value });

    // Prune anything older than window
    const cutoff = now - WINDOW_MS;
    while (ds.data.length && new Date(ds.data[0].x).getTime() < cutoff) {
      ds.data.shift();
    }

    chart.update("none");
  }, [resourceUpdate]);

  return (
    <div className="w-full h-full">
      <Line ref={chartRef} data={data.current} options={options.current} />
    </div>
  );
};

export default SpeedChartComponent;
