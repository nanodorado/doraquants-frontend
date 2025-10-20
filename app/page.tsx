'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { usePortfolio, useHealthCheck, useMarketData, useTrades } from '@/lib/hooks';
import { getPrices } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedInterval, setSelectedInterval] = useState('1h');
  
  // API hooks
  const { portfolio, loading: portfolioLoading, error: portfolioError, refetch: refetchPortfolio } = usePortfolio();
  const { health, loading: healthLoading, error: healthError } = useHealthCheck();
  const { marketData, loading: chartLoading, error: chartError } = useMarketData(selectedSymbol, selectedInterval, 24);
  const { trades, loading: tradesLoading, error: tradesError } = useTrades(selectedSymbol, 20);
  
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [pricesLoading, setPricesLoading] = useState(true);

  // Fetch current prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices(['BTCUSDT', 'ETHUSDT']);
        setPrices(data);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format functions
  const formatPrice = (price: string | number) => {
    return `$${parseFloat(price.toString()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // API Status indicator
  const ApiStatus = () => {
    if (healthLoading) {
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span>Checking API...</span>
        </div>
      );
    }

    if (healthError || !health) {
      return (
        <div className="flex items-center space-x-2 text-red-400">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span>API Offline</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>API Online</span>
      </div>
    );
  };

  // Portfolio Card Component
  const PortfolioCard = () => {
    if (portfolioLoading) {
      return (
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      );
    }

    if (portfolioError) {
      return (
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio</h2>
          <div className="text-red-400 text-center py-8">
            <div className="text-4xl mb-2">⚠️</div>
            <div>Error loading portfolio data</div>
            <div className="text-sm text-gray-400 mt-2">{portfolioError}</div>
            <button 
              onClick={refetchPortfolio}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!portfolio || typeof portfolio.totalUSDT === 'undefined') {
      return (
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio</h2>
          <div className="text-gray-400 text-center py-8">No portfolio data available</div>
        </div>
      );
    }

    return (
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio</h2>
        
        {/* Total USDT */}
        <div className="mb-6">
          <div className="text-gray-300 text-sm">Total Value</div>
          <div className="text-3xl font-bold text-green-400">
            {formatPrice(portfolio.totalUSDT.toString())}
          </div>
        </div>

        {/* Positions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left text-gray-300 py-2">Asset</th>
                <th className="text-right text-gray-300 py-2">Balance</th>
                <th className="text-right text-gray-300 py-2">Value USDT</th>
                <th className="text-right text-gray-300 py-2">%</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(portfolio.positions) && portfolio.positions.length > 0 ? (
                portfolio.positions.map((position, index) => (
                  <tr key={`${position.asset}-${index}`} className="border-b border-gray-700">
                    <td className="py-2 text-white font-medium">{position.asset}</td>
                    <td className="py-2 text-right text-gray-300">{position.total.toFixed(6)}</td>
                    <td className="py-2 text-right text-gray-300">{formatPrice(position.valueUSDT.toString())}</td>
                    <td className="py-2 text-right">
                      <span className="text-green-400">
                        {position.pct.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">No positions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Performance Chart Component
  const PerformanceChart = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#ffffff',
            font: { family: 'Inter' },
          },
        },
        title: {
          display: true,
          text: `${selectedSymbol} Price Chart (${selectedInterval})`,
          color: '#ffffff',
          font: { family: 'Inter', size: 16 },
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#60a5fa',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af', maxTicksLimit: 8 },
          grid: { color: 'rgba(156, 163, 175, 0.1)' },
        },
        y: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value: number | string) {
              return '$' + parseFloat(value.toString()).toLocaleString();
            }
          },
          grid: { color: 'rgba(156, 163, 175, 0.1)' },
        },
      },
    };

    if (chartLoading) {
      return (
        <div className="glass-effect rounded-lg p-6 h-96">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          </div>
        </div>
      );
    }

    if (chartError) {
      return (
        <div className="glass-effect rounded-lg p-6 h-96">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-400 mb-2">⚠️ Failed to load chart</div>
              <div className="text-gray-400 text-sm">{chartError}</div>
            </div>
          </div>
        </div>
      );
    }

    if (!marketData || marketData.length === 0) {
      return (
        <div className="glass-effect rounded-lg p-6 h-96">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">No chart data available</div>
          </div>
        </div>
      );
    }

    const sortedData = [...marketData].sort((a, b) => a.openTime - b.openTime);
    
    const chartData = {
      labels: sortedData.map(kline => {
        const date = new Date(kline.openTime);
        return selectedInterval === '1d' 
          ? date.toLocaleDateString() 
          : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }),
      datasets: [
        {
          label: 'Close Price',
          data: sortedData.map(kline => parseFloat(kline.close)),
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
      ],
    };

    return (
      <div className="glass-effect rounded-lg p-6 h-96">
        <Line options={chartOptions} data={chartData} />
      </div>
    );
  };

  // Recent Trades Component
  const RecentTrades = () => {
    if (tradesLoading) {
      return (
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Recent Trades</h2>
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    if (tradesError) {
      return (
        <div className="glass-effect rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Recent Trades</h2>
          <div className="text-red-400 text-center py-4">
            <div>Failed to load trades</div>
            <div className="text-sm text-gray-400 mt-1">{tradesError}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-effect rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Trades</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left text-gray-300 py-2">Symbol</th>
                <th className="text-right text-gray-300 py-2">Price</th>
                <th className="text-right text-gray-300 py-2">Qty</th>
                <th className="text-right text-gray-300 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {trades && trades.length > 0 ? (
                trades.map((trade, index) => (
                  <tr key={trade.id || index} className="border-b border-gray-700">
                    <td className="py-2 text-white font-medium">{trade.symbol}</td>
                    <td className="py-2 text-right text-gray-300">{formatPrice(trade.price)}</td>
                    <td className="py-2 text-right text-gray-300">{parseFloat(trade.qty).toFixed(4)}</td>
                    <td className="py-2 text-right text-gray-300 text-xs">
                      {formatTime(trade.time)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">No recent trades</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">Doraquants</span>
            </h1>
            <p className="text-gray-300 text-lg">Trading Dashboard</p>
          </div>
          <div className="text-right">
            <ApiStatus />
            <div className="text-xs text-gray-500 mt-1">Backend: localhost:4000</div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="glass-effect rounded-lg p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-gray-300 text-sm mr-2">Symbol:</label>
              <select 
                value={selectedSymbol} 
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-1 border border-gray-600 focus:border-blue-400 outline-none"
              >
                <option value="BTCUSDT">BTCUSDT</option>
                <option value="ETHUSDT">ETHUSDT</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mr-2">Interval:</label>
              <select 
                value={selectedInterval} 
                onChange={(e) => setSelectedInterval(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-1 border border-gray-600 focus:border-blue-400 outline-none"
              >
                <option value="1h">1h</option>
                <option value="1d">1d</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-400">
              Current Price: {pricesLoading ? '...' : formatPrice(prices[selectedSymbol] || '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Portfolio Card */}
          <PortfolioCard />
          
          {/* Recent Trades */}
          <RecentTrades />
        </div>

        {/* Performance Chart - Full Width */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Performance Chart</h2>
          <PerformanceChart />
        </div>
      </main>
    </div>
  );
}
