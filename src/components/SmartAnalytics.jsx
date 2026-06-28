import { useState, useEffect } from 'react';
import { analyzeDigits, predictNextDigit } from '../services/analysis';
import '../styles/components.css';

export default function SmartAnalytics({ digits = [] }) {
  const [analysis, setAnalysis] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [trend, setTrend] = useState('neutral');

  useEffect(() => {
    if (digits.length > 0) {
      const result = analyzeDigits(digits);
      setAnalysis(result);

      // Determine trend
      if (result.rise > result.fall) {
        setTrend('up');
      } else if (result.fall > result.rise) {
        setTrend('down');
      } else {
        setTrend('neutral');
      }

      // Get prediction
      const pred = predictNextDigit(digits, 'trend');
      setPrediction(pred);
    }
  }, [digits]);

  if (!analysis) {
    return <div className="card">Loading analytics...</div>;
  }

  return (
    <div className="smart-analytics">
      <div className="card">
        <h3>Smart Trend Analysis</h3>
        <div className="trend-indicator">
          <span className={`trend ${trend}`}>
            {trend === 'up' ? '📈 UPTREND' : trend === 'down' ? '📉 DOWNTREND' : '➡️ NEUTRAL'}
          </span>
        </div>
      </div>

      <div className="card">
        <h3>Predicted Next Digit</h3>
        <div className="prediction-display">
          <span className="predicted-digit">{prediction}</span>
          <span className="confidence">Based on trend analysis</span>
        </div>
      </div>

      <div className="card">
        <h3>Dominance Analysis</h3>
        <div className="dominance-grid">
          <div className="dominance-item">
            <span className="label">Rise Dominance</span>
            <span className="percent">{((analysis.rise / (analysis.rise + analysis.fall + 1)) * 100).toFixed(1)}%</span>
          </div>
          <div className="dominance-item">
            <span className="label">Fall Dominance</span>
            <span className="percent">{((analysis.fall / (analysis.rise + analysis.fall + 1)) * 100).toFixed(1)}%</span>
          </div>
          <div className="dominance-item">
            <span className="label">Over Dominance</span>
            <span className="percent">{((analysis.over5 / analysis.total) * 100).toFixed(1)}%</span>
          </div>
          <div className="dominance-item">
            <span className="label">Even Dominance</span>
            <span className="percent">{((analysis.even / analysis.total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Pattern Strength</h3>
        <div className="pattern-strength">
          <div className="pattern">
            <span>Matches/Differs Ratio</span>
            <div className="bar">
              <div 
                className="fill matches" 
                style={{ width: `${(analysis.matches / (analysis.matches + analysis.differs + 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="pattern">
            <span>Hot Digit Strength</span>
            <div className="bar">
              <div 
                className="fill hot" 
                style={{ width: `${(analysis.frequency[analysis.hotDigit] / analysis.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
