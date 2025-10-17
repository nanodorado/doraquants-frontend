'use client';

import React, { useEffect, useState } from 'react';
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
import { useMarketData } from '@/lib/hooks';

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

interface ChartExampleProps {
  symbol?: string;
  interval?: string;
  limit?: number;
}

const ChartExample: React.FC<ChartExampleProps> = ({ 
  symbol = 'BTCUSDT', 
  interval = '1h', 
  limit = 24 
}) => {
  const { marketData, loading, error } = useMarketData(symbol, interval, limit);
  const [chartData, setChartData] = useState<any>(null);

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
        text: loading ? 'Loading...' : error ? 'Error Loading Data' : `${symbol} Price Chart (${interval})`,
        color: '#ffffff',
        font: {
          family: 'Inter',
          size: 16,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#60a5fa',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${parseFloat(context.parsed.y).toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return '$' + parseFloat(value).toLocaleString();
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  useEffect(() => {
    if (marketData && marketData.length > 0) {
      // Sort by timestamp to ensure correct order
      const sortedData = [...marketData].sort((a, b) => a.openTime - b.openTime);
      
      const labels = sortedData.map(kline => {
        const date = new Date(kline.openTime);
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          month: 'short',
          day: 'numeric'
        });
      });

      const prices = sortedData.map(kline => parseFloat(kline.close));
      const highs = sortedData.map(kline => parseFloat(kline.high));
      const lows = sortedData.map(kline => parseFloat(kline.low));

      setChartData({
        labels,
        datasets: [
          {
            label: 'Close Price',
            data: prices,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
          },
          {
            label: 'High',
            data: highs,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 1,
          },
          {
            label: 'Low',
            data: lows,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            borderWidth: 1,
          },
        ],
      });
    } else if (!loading && !error) {
      // Fallback data when no API data is available
      const fallbackLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setChartData({
        labels: fallbackLabels,
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
      });
    }
  }, [marketData, loading, error]);

  if (error) {
    return (
      <div className="glass-effect rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️ Failed to load chart data</div>
          <div className="text-gray-400 text-sm">{error}</div>
          <div className="text-gray-500 text-xs mt-2">
            Make sure the backend server is running at http://localhost:4000
          </div>
        </div>
      </div>
    );
  }

  if (loading || !chartData) {
    return (
      <div className="glass-effect rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <div className="text-gray-400">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-lg p-6 h-96">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ChartExample;
