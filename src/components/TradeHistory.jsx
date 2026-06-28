import { useState, useEffect } from 'react';
import '../styles/components.css';

export default function TradeHistory({ traderState }) {
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (traderState && traderState.trades) {
      setTrades(traderState.trades);
    }
  }, [traderState]);

  const filteredTrades = trades.filter(trade => {
    if (filter === 'won') return trade.status === 'won';
    if (filter === 'lost') return trade.status === 'lost';
    if (filter === 'pending') return trade.status === 'pending';
    return true;
  });

  return (
    <div className="trade-history-panel">
      <div className="history-header">
        <h3>Trade History</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({trades.length})
          </button>
          <button
            className={`filter-btn ${filter === 'won' ? 'active' : ''}`}
            onClick={() => setFilter('won')}
          >
            Won ({trades.filter(t => t.status === 'won').length})
          </button>
          <button
            className={`filter-btn ${filter === 'lost' ? 'active' : ''}`}
            onClick={() => setFilter('lost')}
          >
            Lost ({trades.filter(t => t.status === 'lost').length})
          </button>
        </div>
      </div>

      <div className="trades-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Digit</th>
              <th>Direction</th>
              <th>Stake</th>
              <th>Result</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length > 0 ? (
              filteredTrades.map(trade => (
                <tr key={trade.id} className={`trade-${trade.status}`}>
                  <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                  <td className="digit-cell">{trade.digit}</td>
                  <td>{trade.direction}</td>
                  <td>${trade.stake.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${trade.status}`}>
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className={trade.profit_loss >= 0 ? 'profit' : 'loss'}>
                    {trade.profit_loss ? `$${trade.profit_loss.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No trades yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
