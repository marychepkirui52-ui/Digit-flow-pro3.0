import { useState, useEffect, useCallback } from 'react';
import { connectDeriv, disconnect, subscribe, authorize } from './services/deriv';
import { useTraderState } from './hooks/useTraderState';
import Dashboard from './components/Dashboard';
import LoginModal from './components/LoginModal';
import './styles/app.css';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedVolatility, setSelectedVolatility] = useState('R_100');
  const [ticks, setTicks] = useState([]);
  const [error, setError] = useState(null);
  const traderState = useTraderState();

  const volatilities = [
    { id: 'R_100', name: 'Volatility 100 Index' },
    { id: 'R_75', name: 'Volatility 75 Index' },
    { id: 'R_50', name: 'Volatility 50 Index' },
    { id: 'R_25', name: 'Volatility 25 Index' },
    { id: 'R_10', name: 'Volatility 10 Index' },
    { id: 'R_1', name: 'Volatility 1 Index' }
  ];

  const handleConnect = useCallback(() => {
    try {
      const socket = connectDeriv((tick) => {
        setTicks(prev => {
          const next = [...prev, tick];
          if (next.length > 200) next.shift();
          return next;
        });
      });
      setConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to connect to Deriv');
      console.error(err);
    }
  }, []);

  const handleAuthorize = useCallback((token) => {
    try {
      authorize(token);
      setAuthorized(true);
      setShowLogin(false);
      setError(null);
    } catch (err) {
      setError('Authorization failed');
      console.error(err);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setConnected(false);
    setAuthorized(false);
  }, []);

  const handleVolulatilityChange = useCallback((volatility) => {
    setSelectedVolatility(volatility);
    subscribe(volatility);
  }, []);

  useEffect(() => {
    if (connected && selectedVolatility) {
      subscribe(selectedVolatility);
    }
  }, [connected, selectedVolatility]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="app">
      {error && <div className="error-banner">{error}</div>}
      
      {showLogin && !authorized && (
        <LoginModal 
          onAuthorize={handleAuthorize}
          onClose={() => setShowLogin(false)}
        />
      )}
      
      <Dashboard
        connected={connected}
        authorized={authorized}
        selectedVolatility={selectedVolatility}
        volatilities={volatilities}
        ticks={ticks}
        traderState={traderState}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onVolulatilityChange={handleVolulatilityChange}
        onLogin={() => setShowLogin(true)}
      />
    </div>
  );
}
