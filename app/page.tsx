import ChartExample from './components/ChartExample';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Doraquants</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
            AI-driven analytics and portfolio intelligence for modern traders
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Portfolio Overview */}
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Portfolio Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Value</span>
                <span className="text-2xl font-bold text-green-400">$22,000.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">24h Change</span>
                <span className="text-lg font-semibold text-green-400">+5.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Positions</span>
                <span className="text-lg font-semibold text-blue-400">8</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-effect rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">BTC</div>
                <div className="text-gray-300">$45,230</div>
                <div className="text-green-400 text-sm">+2.1%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">ETH</div>
                <div className="text-gray-300">$2,890</div>
                <div className="text-red-400 text-sm">-0.8%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">BNB</div>
                <div className="text-gray-300">$325</div>
                <div className="text-green-400 text-sm">+1.5%</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">SOL</div>
                <div className="text-gray-300">$125</div>
                <div className="text-green-400 text-sm">+4.2%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-white">Performance Analytics</h2>
          <ChartExample />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Real-time Analytics</h3>
            <p className="text-gray-300">Advanced market analysis with AI-powered insights</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-gray-300">Execute trades with minimal latency and maximum precision</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Secure & Reliable</h3>
            <p className="text-gray-300">Bank-grade security with 99.9% uptime guarantee</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; 2024 Doraquants. All rights reserved.</p>
      </footer>
    </div>
  );
}
