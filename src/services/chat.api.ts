const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getConversationMessagesApi = async (
  otherUserId: string,
  currentUserId: string,
): Promise<Message[]> => {
  const response = await fetch(
    `${API_URL}/chat/messages/${otherUserId}`,
    {
      headers: {
        'x-user-id': currentUserId,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
};

export const sendMessageApi = async (
  receiverId: string,
  content: string,
  senderId: string,
): Promise<Message> => {
  const response = await fetch(`${API_URL}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': senderId,
    },
    body: JSON.stringify({ receiverId, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};