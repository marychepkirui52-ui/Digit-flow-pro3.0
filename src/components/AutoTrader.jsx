import { useState, useEffect } from 'react';
import { SmartTrader } from '../services/trader';
import '../styles/components.css';

export default function AutoTrader({ traderState, lastDigits, authorized }) {
  const [trader, setTrader] = useState(null);
  const [running, setRunning] = useState(false);
  const [config, setConfig] = useState({
    stakes: 10,
    duration: 5,
    martingale_enabled: false,
    martingale_multiplier: 2,
    max_stake: 1000,
    auto_recovery: false,
    stop_on_flip: false,
    volatility_guard: 10
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const newTrader = new SmartTrader(config);
    setTrader(newTrader);
  }, [config]);

  const handleStart = () => {
    if (!authorized) {
      alert('Please login first');
      return;
    }
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
    if (trader) {
      setStats(trader.getSessionStats());
    }
  };

  const handleReset = () => {
    if (trader) {
      trader.reset();
      setRunning(false);
      setStats(null);
    }
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="auto-trader-panel">
      <div className="config-section">
        <h3>Auto Trader Configuration</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Base Stake ($)</label>
            <input
              type="number"
              min="1"
              value={config.stakes}
              onChange={(e) => handleConfigChange('stakes', parseFloat(e.target.value))}
              disabled={running}
            />
          </div>

          <div className="config-item">
            <label>Duration (Ticks)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.duration}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              disabled={running}
            />
          </div>

          <div className="config-item">
            <label>Max Stake ($)</label>
            <input
              type="number"
              min="1"
              value={config.max_stake}
              onChange={(e) => handleConfigChange('max_stake', parseFloat(e.target.value))}
              disabled={running}
            />
          </div>

          <div className="config-item">
            <label>Volatility Guard (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={config.volatility_guard}
              onChange={(e) => handleConfigChange('volatility_guard', parseFloat(e.target.value))}
              disabled={running}
            />
          </div>
        </div>

        <div className="toggles-section">
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={config.martingale_enabled}
              onChange={(e) => handleConfigChange('martingale_enabled', e.target.checked)}
              disabled={running}
            />
            <span>Enable Martingale</span>
          </label>

          {config.martingale_enabled && (
            <div className="config-item">
              <label>Martingale Multiplier</label>
              <input
                type="number"
                min="1.1"
                step="0.1"
                value={config.martingale_multiplier}
                onChange={(e) => handleConfigChange('martingale_multiplier', parseFloat(e.target.value))}
                disabled={running}
              />
            </div>
          )}

          <label className="toggle-item">
            <input
              type="checkbox"
              checked={config.auto_recovery}
              onChange={(e) => handleConfigChange('auto_recovery', e.target.checked)}
              disabled={running}
            />
            <span>Auto Recovery</span>
          </label>

          <label className="toggle-item">
            <input
              type="checkbox"
              checked={config.stop_on_flip}
              onChange={(e) => handleConfigChange('stop_on_flip', e.target.checked)}
              disabled={running}
            />
            <span>Stop on Dominance Flip</span>
          </label>
        </div>
      </div>

      <div className="controls-section">
        {!running ? (
          <button className="btn-primary" onClick={handleStart}>
            Start Auto Trader
          </button>
        ) : (
          <button className="btn-danger" onClick={handleStop}>
            Stop Auto Trader
          </button>
        )}
        <button className="btn-secondary" onClick={handleReset}>
          Reset Session
        </button>
      </div>

      {stats && (
        <div className="stats-section">
          <h3>Session Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="label">Total Trades</span>
              <span className="value">{stats.total_trades}</span>
            </div>
            <div className="stat-card">
              <span className="label">Won</span>
              <span className="value won">{stats.won_trades}</span>
            </div>
            <div className="stat-card">
              <span className="label">Lost</span>
              <span className="value lost">{stats.lost_trades}</span>
            </div>
            <div className="stat-card">
              <span className="label">Win Rate</span>
              <span className="value">{stats.win_rate}%</span>
            </div>
            <div className="stat-card">
              <span className="label">Profit</span>
              <span className="value profit">${stats.session_profit.toFixed(2)}</span>
            </div>
            <div className="stat-card">
              <span className="label">Loss</span>
              <span className="value loss">${stats.session_loss.toFixed(2)}</span>
            </div>
            <div className="stat-card">
              <span className="label">Net</span>
              <span className={`value ${stats.net_profit_loss >= 0 ? 'profit' : 'loss'}`}>
                ${stats.net_profit_loss.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
