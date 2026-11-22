import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getSocket } from '../services/socket';
import { useAuthStore } from '../store/auth.store';
import { chatKeys } from '../constants/chat.keys';
import { Message } from '../constants/types';

export function useIncomingMessages() {
  const userId = useAuthStore((state) => state.user?._id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket(userId);

    const handleIncomingMessage = (message: Message) => {
        console.log('Incoming message:', message);
      const senderId =
        typeof message.sender === 'string'
          ? message.sender
          : (message.sender as any)._id;

      const receiverId =
        typeof message.receiver === 'string'
          ? message.receiver
          : (message.receiver as any)._id;

      const otherUserId =
        senderId === userId ? receiverId : senderId;

      if (receiverId !== userId) return;

      queryClient.setQueryData<Message[]>(
        chatKeys.conversation(userId, otherUserId),
        (oldMessages = []) => {
          const alreadyExists = oldMessages.some(
            (existing) => existing._id === message._id,
          );

          if (alreadyExists) return oldMessages;

          return [...oldMessages, message];
        },
      );
    };

    socket.on('message:new', handleIncomingMessage);

    return () => {
      socket.off('message:new', handleIncomingMessage);
    };
  }, [userId, queryClient]);
}