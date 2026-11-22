
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../store/auth.store';
import UserList, { type ChatUser } from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { getAllUsersApi } from '../api/users.api';

import { usePresence } from '../hooks/usePresence';
import useSocketConnection from '../hooks/useSocketConnection';

export default function DashboardPage() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Socket lifecycle and presence subscriptions
  useSocketConnection();
  usePresence();

  // Fetch users using TanStack Query
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const response = await getAllUsersApi();
      return response.users;
    },
  });

  // Automatically select the first available user
  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

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
    <main className="flex h-screen flex-col overflow-hidden bg-[#080d18] text-slate-100">

      {/* Top Navigation */}
      <header className="z-10 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#111827]/95 px-4 backdrop-blur-xl sm:px-8">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-950/40">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              SocketSpace
            </h1>

            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
              Real-time messaging
            </p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 sm:gap-5">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-200">
              {user?.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {user?.email}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/20 bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/30">
            {initials || 'U'}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 sm:px-4 sm:text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <section className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 p-3 sm:p-5 lg:p-6">

        <div className="grid min-h-0 w-full grid-cols-1 grid-rows-[minmax(180px,35%)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111827] shadow-2xl shadow-black/20 lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-1">

          {/* Sidebar */}
          <UserList
            users={users}
            selectedUserId={selectedUser?._id ?? null}
            onSelectUser={setSelectedUser}
          />

          {/* Chat Window */}
          <ChatWindow selectedUser={selectedUser} />

        </div>
      </section>

      {/* Users Loading / Error Feedback */}
      {isLoading && (
        <div className="pointer-events-none absolute bottom-5 right-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-400 shadow-xl">
          Loading contacts...
        </div>
      )}

      {isError && (
        <div className="absolute bottom-5 right-5 rounded-xl border border-red-500/20 bg-red-950/90 px-4 py-3 text-sm text-red-400 shadow-xl">
          {error instanceof Error
            ? error.message
            : 'Failed to load users'}
        </div>
      )}

    </main>
  );
}
