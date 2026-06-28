const APP_ID = 1089;

let socket = null;
let reconnectTimeout = null;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectAttempts = 0;

export function connectDeriv(onTick) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(
    `wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`
  );

  socket.onopen = () => {
    console.log('Connected to Deriv');
    reconnectAttempts = 0;
    socket.send(
      JSON.stringify({
        ticks: 'R_100'
      })
    );
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.tick) {
        onTick(data.tick.quote);
      }
    } catch (err) {
      console.error('Error parsing tick data:', err);
    }
  };

  socket.onerror = (err) => {
    console.error('Deriv Error', err);
  };

  socket.onclose = () => {
    console.log('Connection closed');
    socket = null;
  };

  return socket;
}

export function authorize(token) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      authorize: token
    })
  );
}

export function subscribe(symbol = 'R_100') {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      ticks: symbol
    })
  );
}

export function disconnect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function isConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}
