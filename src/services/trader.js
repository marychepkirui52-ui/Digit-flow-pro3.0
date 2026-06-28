export class SmartTrader {
  constructor(config = {}) {
    this.config = {
      stakes: config.stakes || 10,
      stake_type: config.stake_type || 'contract',
      duration: config.duration || 5,
      duration_unit: config.duration_unit || 'ticks',
      martingale_enabled: config.martingale_enabled || false,
      martingale_multiplier: config.martingale_multiplier || 2,
      max_stake: config.max_stake || 1000,
      stop_loss: config.stop_loss || null,
      take_profit: config.take_profit || null,
      auto_recovery: config.auto_recovery || false,
      stop_on_flip: config.stop_on_flip || false,
      volatility_guard: config.volatility_guard || 10,
      ...config
    };
    
    this.trades = [];
    this.session_profit = 0;
    this.session_loss = 0;
    this.active_trades = [];
    this.martingale_level = 1;
  }

  calculateStake(baseStake) {
    if (this.config.martingale_enabled) {
      const stake = baseStake * Math.pow(this.config.martingale_multiplier, this.martingale_level - 1);
      return Math.min(stake, this.config.max_stake);
    }
    return baseStake;
  }

  placeTrade(digit, direction, stake = null) {
    const tradeStake = stake || this.calculateStake(this.config.stakes);
    
    const trade = {
      id: Date.now(),
      digit,
      direction,
      stake: tradeStake,
      timestamp: new Date(),
      status: 'pending',
      entry_price: null,
      exit_price: null,
      profit_loss: null
    };

    this.active_trades.push(trade);
    this.trades.push(trade);
    
    return trade;
  }

  updateTrade(tradeId, result) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade) return null;

    trade.status = result.win ? 'won' : 'lost';
    trade.profit_loss = result.profit_loss;
    trade.exit_price = result.exit_price;

    if (result.win) {
      this.session_profit += result.profit_loss;
      this.martingale_level = 1;
    } else {
      this.session_loss += Math.abs(result.profit_loss);
      if (this.config.martingale_enabled) {
        this.martingale_level++;
      }
    }

    this.active_trades = this.active_trades.filter(t => t.id !== tradeId);
    
    return trade;
  }

  getSessionStats() {
    return {
      total_trades: this.trades.length,
      won_trades: this.trades.filter(t => t.status === 'won').length,
      lost_trades: this.trades.filter(t => t.status === 'lost').length,
      session_profit: this.session_profit,
      session_loss: this.session_loss,
      net_profit_loss: this.session_profit - this.session_loss,
      win_rate: this.trades.length > 0 
        ? ((this.trades.filter(t => t.status === 'won').length / this.trades.length) * 100).toFixed(2)
        : 0,
      active_trades: this.active_trades.length
    };
  }

  reset() {
    this.trades = [];
    this.active_trades = [];
    this.session_profit = 0;
    this.session_loss = 0;
    this.martingale_level = 1;
  }
}

export class DifferScanner {
  constructor(config = {}) {
    this.config = config;
    this.scan_history = {};
    this.rarest_digits = {};
  }

  scanForDiffers(history, volatility) {
    if (!history || history.length < 2) return null;

    const lastDigit = history[history.length - 1];
    const prevDigit = history[history.length - 2];

    if (lastDigit === prevDigit) {
      return null;
    }

    const digitCounts = {};
    history.forEach(d => {
      digitCounts[d] = (digitCounts[d] || 0) + 1;
    });

    let rarest = null;
    let minCount = Infinity;

    for (let i = 0; i < 10; i++) {
      const count = digitCounts[i] || 0;
      if (count < minCount) {
        minCount = count;
        rarest = i;
      }
    }

    return {
      volatility,
      differs: true,
      last_digit: lastDigit,
      predicted_digit: rarest,
      rarest_count: minCount,
      timestamp: new Date()
    };
  }

  scanAllVolatilities(volatilityData) {
    const signals = [];
    
    for (const [vol, history] of Object.entries(volatilityData)) {
      const signal = this.scanForDiffers(history, vol);
      if (signal) {
        signals.push(signal);
      }
    }

    return signals;
  }
}
