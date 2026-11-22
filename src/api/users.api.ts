
import { ChatUser } from '../components/UserList';
import type { User } from '../store/auth.store';
import { usePresenceStore } from '../store/presence.store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface GetAllUsersResponse {
  users: ChatUser[];
}

export const getAllUsersApi = async (): Promise<GetAllUsersResponse> => {
  const response = await fetch(`${API_URL}/users/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data: ChatUser[] = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  // Save online user IDs in Zustand
  const onlineUserIds = data
    .filter((user) => user.online)
    .map((user) => user._id);

  usePresenceStore.getState().setOnlineUsers(onlineUserIds);

  return { users: data };
};
