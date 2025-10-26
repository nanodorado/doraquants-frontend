// API client for Doraquants backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Types for API responses
export interface Position {
  asset: string;
  free: number;
  locked: number;
  total: number;
  priceUSDT: number;
  valueUSDT: number;
  pct: number;
}

export interface PortfolioResponse {
  status: string;
  testnet: boolean;
  totalUSDT: number;
  positions: Position[];
  positionCount: number;
  timestamp: string;
}

export interface Portfolio {
  totalUSDT: number;
  positions: Position[];
}

export interface Trade {
  symbol: string;
  id: number;
  orderId: number;
  side: 'BUY' | 'SELL';
  qty: string;
  price: string;
  realizedPnl: string;
  time: number;
  commission: string;
  commissionAsset: string;
}

export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  count: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add API key if available (optional for development)
  if (API_KEY && API_KEY !== 'your_api_key_here') {
    headers['x-api-key'] = API_KEY;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Network error: Unable to connect to API at ${url}. Make sure the backend server is running.`
      );
    }
    
    // Re-throw other errors
    throw error;
  }
}

/**
 * Get portfolio information including total USDT balance and positions
 */
export async function getPortfolio(): Promise<Portfolio> {
  try {
    const data = await apiRequest<PortfolioResponse>('/api/binance/portfolio');
    console.log("Portfolio data:", data);
    
    // Transform backend response to frontend format
    const portfolio: Portfolio = {
      totalUSDT: data.totalUSDT || 0,
      positions: Array.isArray(data.positions) ? data.positions : []
    };
    
    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw new Error(`Failed to fetch portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get market data (klines/candlestick data) for a symbol
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param interval - Kline interval (e.g., '1m', '5m', '1h', '1d')
 * @param limit - Number of klines to return (default: 100, max: 1000)
 */
export async function getMarketData(
  symbol: string,
  interval: string = '1h',
  limit: number = 100
): Promise<Kline[]> {
  try {
    const params = new URLSearchParams({
      symbol: symbol.toUpperCase(),
      interval,
      limit: limit.toString(),
    });

    const data = await apiRequest<Kline[]>(`/api/binance/market-data?${params}`);
    console.log("Market data received:", data);
    console.log("typeof marketData:", typeof data);
    console.log("Array.isArray(marketData):", Array.isArray(data));
    
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.warn('Market data is not an array, returning empty array');
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error(`Failed to fetch market data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get recent trades for a symbol
 * @param symbol - Trading pair symbol (e.g., 'BTCUSDT')
 * @param limit - Number of trades to return (default: 50, max: 1000)
 */
export async function getTrades(
  symbol: string,
  limit: number = 50
): Promise<Trade[]> {
  try {
    const params = new URLSearchParams({
      symbol: symbol.toUpperCase(),
      limit: limit.toString(),
    });

    const data = await apiRequest<Trade[]>(`/api/binance/trades?${params}`);
    console.log("Trades data received:", data);
    console.log("typeof trades:", typeof data);
    console.log("Array.isArray(trades):", Array.isArray(data));
    
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      console.warn('Trades data is not an array, returning empty array');
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw new Error(`Failed to fetch trades for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get current market prices for multiple symbols
 */
export async function getPrices(symbols?: string[]): Promise<{ [symbol: string]: string }> {
  try {
    const params = symbols ? new URLSearchParams({
      symbols: symbols.join(',')
    }) : '';

    const data = await apiRequest<{ [symbol: string]: string }>(`/api/binance/prices${params ? `?${params}` : ''}`);
    return data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw new Error(`Failed to fetch prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get exchange information
 */
export async function getExchangeInfo(): Promise<unknown> {
  try {
    const data = await apiRequest('/api/binance/exchange-info');
    return data;
  } catch (error) {
    console.error('Error fetching exchange info:', error);
    throw new Error(`Failed to fetch exchange info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Health check for the API
 */
export async function healthCheck(): Promise<{ status: string; timestamp: number }> {
  try {
    const data = await apiRequest<{ status: string; timestamp: number }>('/health');
    return data;
  } catch (error) {
    console.error('Error in health check:', error);
    throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export API configuration for debugging
export const apiConfig = {
  baseUrl: API_BASE_URL,
  hasApiKey: !!(API_KEY && API_KEY !== 'your_api_key_here'),
  apiKey: API_KEY ? (API_KEY === 'your_api_key_here' ? 'NOT_SET' : 'SET') : 'UNDEFINED',
};
