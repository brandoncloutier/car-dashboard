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
import "chartjs-adapter-luxon";
import { useSelector } from "react-redux";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title
);

const WINDOW_MS = 10_000; // show last 10s

const RPMChartComponent = ({ resource }) => {
  const chartRef = useRef(null);
  const resourceUpdate = useSelector(
    (state) => state.resources.resources_data[resource]
  );
  const { watchResource /*, unwatchResource */ } = useWebSocketContext();

  const data = useRef({
    datasets: [
      {
        label: "Engine RPM",
        data: [], // [{ x: timestamp/string/ms, y: number }]
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
        title: { display: true, text: "RPM" },
      },
    },
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Live RPM Chart" },
    },
  });

  useEffect(() => {
    watchResource(resource);
    // return () => unwatchResource?.(resource);
  }, [resource, watchResource]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (resourceUpdate?.value == null || !resourceUpdate?.date) return;

    const ds = chart.data.datasets[0];
    const now = Date.now();

    // Push newest point
    ds.data.push({ x: resourceUpdate.date, y: resourceUpdate.value });

    // Prune points outside the sliding window
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

export default RPMChartComponent;
