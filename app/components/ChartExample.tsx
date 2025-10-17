'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartExample: React.FC = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            family: 'Inter',
          },
        },
      },
      title: {
        display: true,
        text: 'Portfolio Performance',
        color: '#ffffff',
        font: {
          family: 'Inter',
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Portfolio Value ($)',
        data: [10000, 12000, 11500, 15000, 18000, 22000],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'BTC Holdings ($)',
        data: [5000, 7000, 6500, 9000, 11000, 13000],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="glass-effect rounded-lg p-6 h-96">
      <Line options={options} data={data} />
    </div>
  );
};

export default ChartExample;
