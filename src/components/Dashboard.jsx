import { useState, useEffect } from 'react';
import AutoTrader from './AutoTrader';
import VolatilitySelector from './VolatilitySelector';
import AnalysisPanel from './AnalysisPanel';
import TradeHistory from './TradeHistory';
import SmartAnalytics from './SmartAnalytics';
import DifferScanner from './DifferScanner';
import '../styles/dashboard.css';

export default function Dashboard({
  connected,
  authorized,
  selectedVolatility,
  volatilities,
  ticks,
  traderState,
  onConnect,
  onDisconnect,
  onVolulatilityChange,
  onLogin
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastDigits, setLastDigits] = useState([]);

  useEffect(() => {
    if (ticks.length > 0) {
      const digits = ticks.map(tick => {
        const str = tick.toString();
        return parseInt(str.charAt(str.length - 1));
      });
      setLastDigits(digits);
    }
  }, [ticks]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎯 Digit Flow Pro</h1>
          <span className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <div className="header-right">
          {!connected ? (
            <button className="btn-primary" onClick={onConnect}>
              Connect to Deriv
            </button>
          ) : (
            <button className="btn-secondary" onClick={onDisconnect}>
              Disconnect
            </button>
          )}
          {!authorized && (
            <button className="btn-primary" onClick={onLogin}>
              Login
            </button>
          )}
        </div>
      </header>

      {connected && (
        <>
          <VolatilitySelector
            selected={selectedVolatility}
            volatilities={volatilities}
            onChange={onVolulatilityChange}
          />

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'auto-trader' ? 'active' : ''}`}
              onClick={() => setActiveTab('auto-trader')}
            >
              Auto Trader
            </button>
            <button 
              className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              Analysis
            </button>
            <button 
              className={`tab ${activeTab === 'differ-scanner' ? 'active' : ''}`}
              onClick={() => setActiveTab('differ-scanner')}
            >
              Differ Scanner
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-grid">
                <div className="card">
                  <h3>Current Tick</h3>
                  <div className="current-digit">
                    {lastDigits.length > 0 ? lastDigits[lastDigits.length - 1] : '-'}
                  </div>
                </div>
                <SmartAnalytics digits={lastDigits} />
              </div>
            )}
            
            {activeTab === 'auto-trader' && (
              <AutoTrader 
                traderState={traderState}
                lastDigits={lastDigits}
                authorized={authorized}
              />
            )}
            
            {activeTab === 'analysis' && (
              <AnalysisPanel digits={lastDigits} />
            )}
            
            {activeTab === 'differ-scanner' && (
              <DifferScanner digits={lastDigits} />
            )}
            
            {activeTab === 'history' && (
              <TradeHistory traderState={traderState} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
