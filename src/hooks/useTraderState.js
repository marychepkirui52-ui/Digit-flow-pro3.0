import { useState, useCallback } from 'react';
import { SmartTrader } from '../services/trader';

export function useTraderState() {
  const [trader, setTrader] = useState(new SmartTrader());
  const [trades, setTrades] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const placeTrade = useCallback((digit, direction, stake) => {
    const trade = trader.placeTrade(digit, direction, stake);
    setTrades(prev => [...prev, trade]);
    return trade;
  }, [trader]);

  const updateTrade = useCallback((tradeId, result) => {
    const updated = trader.updateTrade(tradeId, result);
    setTrades(prev => prev.map(t => t.id === tradeId ? updated : t));
    return updated;
  }, [trader]);

  const getStats = useCallback(() => {
    return trader.getSessionStats();
  }, [trader]);

  const reset = useCallback(() => {
    trader.reset();
    setTrades([]);
    setIsRunning(false);
  }, [trader]);

  return {
    trader,
    trades,
    isRunning,
    setIsRunning,
    placeTrade,
    updateTrade,
    getStats,
    reset
  };
}
