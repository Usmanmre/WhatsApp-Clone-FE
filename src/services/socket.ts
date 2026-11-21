
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
let activeUserId: string | null = null;

export const getSocket = (userId: string): Socket => {
  if (socket && activeUserId === userId) {
    return socket;
  }

  // A different user logged in. Close the previous connection.
  if (socket) {
    socket.disconnect();
  }

  activeUserId = userId;

  socket = io(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
    {
      autoConnect: false,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        userId,
      },
    },
  );

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    activeUserId = null;
  }
};
