
import { useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useAuthStore } from '../store/auth.store';
import { usePresenceStore } from '../store/presence.store';

export function usePresence() {
  const user = useAuthStore((state) => state.user);

  const setOnline = usePresenceStore((state) => state.setOnline);
  const setOffline = usePresenceStore((state) => state.setOffline);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket(user._id);

    const handleUserOnline = ({ userId }: { userId: string }) => {
      if (userId === user._id) return;

      setOnline(userId);
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      if (userId === user._id) return;

      setOffline(userId);
    };

    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    return () => {
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [user?._id, setOnline, setOffline]);
}
