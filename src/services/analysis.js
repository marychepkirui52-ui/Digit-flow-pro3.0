export function analyzeDigits(history = []) {
  const DIGITS = 10;
  const frequency = Array(DIGITS).fill(0);

  history.forEach((digit) => {
    if (digit >= 0 && digit <= 9) {
      frequency[digit]++;
    }
  });

  const total = history.length || 1;
  const percentage = frequency.map((count) =>
    Number(((count / total) * 100).toFixed(2))
  );

  const hotDigit = frequency.indexOf(Math.max(...frequency));
  const coldDigit = frequency.indexOf(Math.min(...frequency));

  let over5 = 0;
  let under5 = 0;

  history.forEach((digit) => {
    if (digit >= 5) {
      over5++;
    } else {
      under5++;
    }
  });

  let matches = 0;
  let differs = 0;

  for (let i = 1; i < history.length; i++) {
    if (history[i] === history[i - 1]) {
      matches++;
    } else {
      differs++;
    }
  }

  let rise = 0;
  let fall = 0;

  for (let i = 1; i < history.length; i++) {
    if (history[i] > history[i - 1]) {
      rise++;
    } else if (history[i] < history[i - 1]) {
      fall++;
    }
  }

  let even = 0;
  let odd = 0;

  history.forEach((digit) => {
    if (digit % 2 === 0) {
      even++;
    } else {
      odd++;
    }
  });

  return {
    total,
    frequency,
    percentage,
    hotDigit,
    coldDigit,
    over5,
    under5,
    matches,
    differs,
    rise,
    fall,
    even,
    odd
  };
}

export function extractLastDigit(value) {
  return Number(value.toString().slice(-1));
}

export function predictNextDigit(history = [], method = 'trend') {
  if (history.length < 2) return Math.floor(Math.random() * 10);

  switch (method) {
    case 'trend': {
      const last = history[history.length - 1];
      const prev = history[history.length - 2];
      if (last > prev) return (last + 1) % 10;
      if (last < prev) return (last - 1 + 10) % 10;
      return last;
    }
    case 'frequency': {
      const analysis = analyzeDigits(history.slice(-50));
      return analysis.coldDigit;
    }
    case 'differs': {
      const last = history[history.length - 1];
      return (last + 1) % 10;
    }
    default:
      return Math.floor(Math.random() * 10);
  }
}
