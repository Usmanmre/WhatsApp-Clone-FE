
import { useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useAuthStore } from '../store/auth.store';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export default function useSocketConnection() {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    if (!user?._id) {
      setStatus('disconnected');
      return;
    }

    const socket = getSocket(user._id);

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
      setStatus('connected');
    };

    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setStatus('disconnected');
    };

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error.message);
      setStatus('error');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    setStatus(socket.connected ? 'connected' : 'connecting');

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [user?._id]);

  return status;
}
