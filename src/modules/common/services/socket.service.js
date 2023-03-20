import { io } from 'socket.io-client';
import { httpService } from './http.service';

// const BASE_URL = httpService.url;
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '//localhost:3000';
var socket = null;

export const socketService = {
  connect,
  disconnect,
  on,
  off,
  emit
}

function on(evName, cb) {
  socket?.on(evName, cb);
}
function off(evName, cb) {
  socket?.off(evName, cb);
}
function emit(evName, ...args) {
  socket?.emit(evName, ...args);
}

function connect() {
  if (socket) return socket;
  // socket = io(BASE_URL);
  socket = io(BASE_URL, {
    withCredentials: true,
    // reconnection: false,
    // reconnectionDelayMax: 10000,
    // auyh: { token },
    // query: { key: 'val' },
    // transportOptions: {
    //   polling: {
    //     extraHeaders: {
    //       'SAME_HEADER': 'VAL'
    //     }
    //   }
    // }
  });
  
  return socket;
}

function disconnect() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}