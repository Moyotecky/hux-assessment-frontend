// components/Chart.js

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Chart = ({ data }) => {
  const chartRef = useRef(null);

  // Chart.js configuration
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Sales Data',
        data: data.values || [],
        borderColor: '#4B9CD3',
        backgroundColor: 'rgba(75, 156, 227, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Contact Overview</h2>
      <Line data={chartData} ref={chartRef} />
    </div>
  );
};

export default Chart;
