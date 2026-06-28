import { useState, useEffect } from 'react';
import { analyzeDigits } from '../services/analysis';
import '../styles/components.css';

export default function AnalysisPanel({ digits = [] }) {
  const [analysis, setAnalysis] = useState(null);
  const [last20, setLast20] = useState([]);

  useEffect(() => {
    if (digits.length > 0) {
      const recent = digits.slice(-20);
      setLast20(recent);
      const result = analyzeDigits(digits);
      setAnalysis(result);
    }
  }, [digits]);

  if (!analysis) {
    return <div className="card">Waiting for data...</div>;
  }

  return (
    <div className="analysis-grid">
      <div className="card">
        <h3>Last 20 Ticks</h3>
        <div className="digit-history">
          {last20.map((d, i) => (
            <span key={i} className="digit-badge">{d}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Digit Frequency</h3>
        <div className="frequency-grid">
          {analysis.frequency.map((count, digit) => (
            <div key={digit} className="frequency-item">
              <span className="digit">{digit}</span>
              <span className="count">{count}</span>
              <span className="percent">{analysis.percentage[digit]}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Matches / Differs</h3>
        <div className="stat-row">
          <div className="stat-item">
            <span className="label">Matches</span>
            <span className="value matches">{analysis.matches}</span>
          </div>
          <div className="stat-item">
            <span className="label">Differs</span>
            <span className="value differs">{analysis.differs}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Over / Under</h3>
        <div className="stat-row">
          <div className="stat-item">
            <span className="label">Over (5-9)</span>
            <span className="value over">{analysis.over5}</span>
          </div>
          <div className="stat-item">
            <span className="label">Under (0-4)</span>
            <span className="value under">{analysis.under5}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Even / Odd</h3>
        <div className="stat-row">
          <div className="stat-item">
            <span className="label">Even</span>
            <span className="value even">{analysis.even}</span>
          </div>
          <div className="stat-item">
            <span className="label">Odd</span>
            <span className="value odd">{analysis.odd}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Rise / Fall</h3>
        <div className="stat-row">
          <div className="stat-item">
            <span className="label">Rise</span>
            <span className="value rise">{analysis.rise}</span>
          </div>
          <div className="stat-item">
            <span className="label">Fall</span>
            <span className="value fall">{analysis.fall}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Hot / Cold Digits</h3>
        <div className="stat-row">
          <div className="stat-item">
            <span className="label">Hot</span>
            <span className="digit-badge hot">{analysis.hotDigit}</span>
          </div>
          <div className="stat-item">
            <span className="label">Cold</span>
            <span className="digit-badge cold">{analysis.coldDigit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
