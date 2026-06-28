import '../styles/components.css';

export default function VolatilitySelector({ selected, volatilities, onChange }) {
  return (
    <div className="volatility-selector">
      <h3>Select Volatility Index</h3>
      <div className="volatility-buttons">
        {volatilities.map(vol => (
          <button
            key={vol.id}
            className={`volatility-btn ${selected === vol.id ? 'active' : ''}`}
            onClick={() => onChange(vol.id)}
            title={vol.name}
          >
            {vol.name.split(' ')[1]}
          </button>
        ))}
      </div>
    </div>
  );
}
