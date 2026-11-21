
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/auth.store';
import UserList, { type ChatUser } from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { getAllUsersApi } from '../api/users.api';
export default function DashboardPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);

  const fetchUsers = async () => {
    try {
      const { users } = await getAllUsersApi();

      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(
    users.length > 0 ? users[0] : null,
  );

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-slate-700">

      {/* Top navigation */}
      <header className="z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm shadow-blue-200">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              SocketSpace
            </h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:block">
              Real-time messaging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name}ds
            </p>
            <p className="text-xs text-slate-400">
              {user?.email}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {initials || 'U'}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4 sm:text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main chat area */}
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 p-3 sm:p-5">
        <div className="grid min-h-0 w-full grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_minmax(0,1fr)]">

          <UserList
            users={users}
            selectedUserId={selectedUser?._id ?? null}
            onSelectUser={setSelectedUser}
          />

          <ChatWindow selectedUser={selectedUser} />

        </div>
      </div>
    </main>
  );
}
