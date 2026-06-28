import { useState, useEffect } from 'react';
import { DifferScanner } from '../services/trader';
import { analyzeDigits } from '../services/analysis';
import '../styles/components.css';

export default function DifferScannerComponent({ digits = [] }) {
  const [scanner] = useState(new DifferScanner());
  const [signals, setSignals] = useState([]);
  const [autoTrade, setAutoTrade] = useState(false);
  const [minWinPercent, setMinWinPercent] = useState(55);
  const [bulkContracts, setBulkContracts] = useState(30);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (digits.length >= 2) {
      const result = analyzeDigits(digits);
      setAnalysis(result);

      // Check for differs signal
      if (digits[digits.length - 1] !== digits[digits.length - 2]) {
        const signal = scanner.scanForDiffers(digits, 'R_100');
        if (signal) {
          setSignals(prev => [signal, ...prev.slice(0, 19)]);
        }
      }
    }
  }, [digits, scanner]);

  const differWinRate = analysis 
    ? ((analysis.differs / (analysis.differs + analysis.matches + 1)) * 100).toFixed(2)
    : 0;

  return (
    <div className="differ-scanner-panel">
      <div className="card">
        <h3>Differ Detection Scanner</h3>
        <div className="scanner-stats">
          <div className="stat-item">
            <span className="label">Last Differs Count</span>
            <span className="value">{analysis?.differs || 0}</span>
          </div>
          <div className="stat-item">
            <span className="label">Rarest Digit</span>
            <span className="digit-badge">{analysis?.coldDigit}</span>
          </div>
          <div className="stat-item">
            <span className="label">Differs Win %</span>
            <span className={`value ${differWinRate >= minWinPercent ? 'profit' : 'loss'}`}>
              {differWinRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Scanner Configuration</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Min Win % for Trade</label>
            <input
              type="number"
              min="50"
              max="100"
              value={minWinPercent}
              onChange={(e) => setMinWinPercent(parseFloat(e.target.value))}
              disabled={autoTrade}
            />
          </div>
          <div className="config-item">
            <label>Bulk Contracts per Signal</label>
            <input
              type="number"
              min="1"
              max="100"
              value={bulkContracts}
              onChange={(e) => setBulkContracts(parseInt(e.target.value))}
              disabled={autoTrade}
            />
          </div>
        </div>

        <label className="toggle-item">
          <input
            type="checkbox"
            checked={autoTrade}
            onChange={(e) => setAutoTrade(e.target.checked)}
          />
          <span>Auto Trade Differs Signals</span>
        </label>

        <div className="signal-status">
          {autoTrade && differWinRate >= minWinPercent ? (
            <div className="status-badge trading">
              🟢 Trading Active - Win Rate Meets Threshold
            </div>
          ) : autoTrade && differWinRate < minWinPercent ? (
            <div className="status-badge waiting">
              🟡 Waiting - Win Rate Below Threshold ({differWinRate}% &lt; {minWinPercent}%)
            </div>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h3>Recent Signals</h3>
        <div className="signals-list">
          {signals.length > 0 ? (
            signals.map((signal, idx) => (
              <div key={idx} className="signal-item">
                <span className="timestamp">
                  {new Date(signal.timestamp).toLocaleTimeString()}
                </span>
                <span className="label">Predicted:</span>
                <span className="digit-badge">{signal.predicted_digit}</span>
                <span className="label">Rarity:</span>
                <span className="value">{signal.rarest_count}</span>
              </div>
            ))
          ) : (
            <p className="no-data">Waiting for differ signals...</p>
          )}
        </div>
      </div>
    </div>
  );
}
