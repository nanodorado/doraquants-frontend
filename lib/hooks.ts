'use client';

import { useState, useEffect } from 'react';
import { Portfolio, Trade, Kline, getPortfolio, getTrades, getMarketData, healthCheck } from '@/lib/api';

// Hook for portfolio data
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return { portfolio, loading, error, refetch: fetchPortfolio };
}

// Hook for trades data
export function useTrades(symbol: string, limit: number = 50) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrades(symbol, limit);
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchTrades();
    }
  }, [symbol, limit]);

  return { trades, loading, error, refetch: fetchTrades };
}

// Hook for market data
export function useMarketData(symbol: string, interval: string = '1h', limit: number = 100) {
  const [marketData, setMarketData] = useState<Kline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMarketData(symbol, interval, limit);
      setMarketData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchMarketData();
    }
  }, [symbol, interval, limit]);

  return { marketData, loading, error, refetch: fetchMarketData };
}

// Hook for API health check
export function useHealthCheck() {
  const [health, setHealth] = useState<{ status: string; timestamp: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthCheck();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return { health, loading, error, refetch: checkHealth };
}
