
import { create } from 'zustand';

interface ChatState {
  activeConversationUserId: string | null;

  setActiveConversation: (userId: string | null) => void;
  clearActiveConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationUserId: null,

  setActiveConversation: (userId) =>
    set({
      activeConversationUserId: userId,
    }),

  clearActiveConversation: () =>
    set({
      activeConversationUserId: null,
    }),
}));
