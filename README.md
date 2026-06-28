# Digit Flow Pro - Advanced Deriv Trading Bot

A comprehensive React-based dashboard for real-time digit prediction and automated trading on the Deriv platform.

## Features

### 🚀 Core Features
- **Live Deriv Connection**: Real-time WebSocket connection to Deriv API
- **Multi-Volatility Support**: Trade across all volatility indices (100, 75, 50, 25, 10, 1)
- **Switchable Ticks Display**: View live digit streams with circular ticker display

### 📊 Advanced Analysis
- **Digit Analysis**: Last 20 ticks with frequency distribution
- **Pattern Recognition**:
  - Matches / Differs analysis
  - Over / Under (5-9 vs 0-4)
  - Even / Odd classification
  - Rise / Fall trends
- **Hot/Cold Digit Detection**: Identify most and least frequent digits
- **Smart Trend Prediction**: AI-powered next digit prediction

### 🤖 Smart Auto Trader
- **Configurable Stakes**: Adjustable base stake and max stake limits
- **Martingale Support**: Auto-scale stakes after losses
- **Auto Recovery**: Scale stakes to recover from losing streaks
- **Stop on Dominance Flip**: Auto-halt when trends reverse
- **Volatility Guard**: Protection against high volatility periods
- **Session P&L Tracking**: Real-time profit/loss monitoring

### 🔍 Differ Scanner
- **Automatic Scanning**: Scan all volatilities for rarest digits
- **Differs Detection**: Automatically identify when digits change
- **Min Win % Filter**: Only trade when win percentage meets threshold
- **Bulk Fire**: Execute 30 contracts per confirmed signal
- **Auto Trade**: Automatic execution when conditions met

### ✅ Smart Confirmation
- **3-Scan Hold**: Wait for digit to hold across 3 scans before trading
- **Configurable Duration**: Set tick duration for trades
- **Edge %**: Set profit margin requirements
- **SL/TP**: Stop Loss and Take Profit levels in dollars
- **Predicted Digit Display**: Show AI prediction before execution

### 📈 Advanced Features
- **Martingale Recovery**: Auto-scale stakes with multipliers
- **Max Stake Cap**: Limit maximum exposure
- **Live Scanner**: Monitor all volatilities history in real-time
- **Trade History**: Complete trade logs with P&L details
- **Performance Stats**: Win rate, total trades, net profit/loss

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Deployment (GitHub Pages)

1. Update `vite.config.js` with your repository name:
```javascript
export default defineConfig({
  base: '/Digit-flow-pro3.0/'
});
```

2. Build the project:
```bash
npm run build
```

3. Push to GitHub:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin feature/full-dashboard-implementation
```

4. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch as source
   - Your site will be available at `https://marychepkirui52-ui.github.io/Digit-flow-pro3.0/`

## Configuration

### Deriv API Setup
1. Register at [Deriv](https://deriv.com)
2. Go to Settings → API tokens
3. Create a new token with appropriate permissions
4. Use the token to authorize in the dashboard

### Auto Trader Settings
- **Base Stake**: Starting amount for each trade
- **Duration**: Number of ticks for trade to expire
- **Martingale Multiplier**: Scaling factor (default: 2x)
- **Max Stake**: Maximum allowed stake amount
- **Volatility Guard**: % threshold for volatility protection

## Usage

1. **Connect**: Click "Connect to Deriv" button
2. **Authorize**: Login with your Deriv API token
3. **Select Volatility**: Choose your preferred volatility index
4. **Configure**: Set your trading parameters
5. **Start**: Launch the auto trader
6. **Monitor**: Track trades in real-time

## Architecture

```
src/
├── components/          # React components
│   ├── Dashboard.jsx
│   ├── AutoTrader.jsx
│   ├── AnalysisPanel.jsx
│   ├── DifferScanner.jsx
│   ├── SmartAnalytics.jsx
│   ├── TradeHistory.jsx
│   └── LoginModal.jsx
├── services/           # Business logic
│   ├── deriv.js       # WebSocket connection
│   ├── analysis.js    # Digit analysis
│   └── trader.js      # Trading logic
├── hooks/             # Custom React hooks
│   └── useTraderState.js
└── styles/            # Styling
    ├── index.css
    ├── app.css
    ├── dashboard.css
    └── components.css
```

## Risk Disclaimer

**WARNING**: This bot is for educational purposes. Trading on Deriv involves substantial risk. Use responsibly and never risk money you cannot afford to lose. Always test with demo accounts first.

## License

MIT License - See LICENSE file for details

## Support

For issues or feature requests, please open an issue on GitHub.
