import type { User } from '../store/auth.store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface GetAllUsersResponse {
  users: User[];
}

export const getAllUsersApi = async (
): Promise<GetAllUsersResponse> => {
  const response = await fetch(`${API_URL}/users/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();


  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return {users: data};
};