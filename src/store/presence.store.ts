
import { create } from 'zustand';

interface PresenceState {
  onlineUsers: Set<string>;

  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;
  isOnline: (userId: string) => boolean;
  clearPresence: () => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: new Set(),

  setOnline: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),

  setOffline: (userId) =>
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.delete(userId);

      return { onlineUsers: updated };
    }),

  setOnlineUsers: (userIds) =>
    set({
      onlineUsers: new Set(userIds),
    }),

  isOnline: (userId) => get().onlineUsers.has(userId),

  clearPresence: () => set({ onlineUsers: new Set() }),
}));
