
import { useMemo, useState } from 'react';
import useSocketConnection from '../hooks/useSocketConnection';
import { usePresenceStore } from '../store/presence.store';

export interface ChatUser {
  _id: string;
  name: string;
  email: string;
  online?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface UserListProps {
  users: ChatUser[];
  selectedUserId: string | null;
  onSelectUser: (user: ChatUser) => void;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function UserList({
  users,
  selectedUserId,
  onSelectUser,
}: UserListProps) {
  const [search, setSearch] = useState('');

  const socketStatus = useSocketConnection();
  const onlineUsers = usePresenceStore((state) => state.onlineUsers);

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm),
    );
  }, [users, search]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-slate-800/80 bg-[#111827] text-slate-100">

      {/* Header */}
      <div className="border-b border-slate-800/80 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Messages
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {users.length} contacts
            </p>
          </div>

          {/* Socket Connection Status */}
          <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-800/60 px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                socketStatus === 'connected'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : socketStatus === 'connecting'
                    ? 'animate-pulse bg-amber-400'
                    : 'bg-red-400'
              }`}
            />

            <span className="text-[10px] font-medium text-slate-400">
              {socketStatus === 'connected'
                ? 'Connected'
                : socketStatus === 'connecting'
                  ? 'Connecting'
                  : socketStatus === 'error'
                    ? 'Connection error'
                    : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
            className="w-full rounded-xl border border-slate-700/70 bg-[#1e293b]/70 py-3 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500/70 focus:bg-slate-800"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18 6-12 12M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Recent conversations
          </p>

          <span className="text-[10px] text-slate-600">
            {filteredUsers.length}
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/60">
              <svg
                className="h-5 w-5 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-4-4" />
              </svg>
            </div>

            <p className="text-sm font-medium text-slate-300">
              No users found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try searching with another name.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredUsers.map((user) => {
              const selected = selectedUserId === user._id;
              const isOnline = onlineUsers.has(user._id);

              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => onSelectUser(user)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                    selected
                      ? 'bg-blue-500/10 ring-1 ring-blue-500/30'
                      : 'hover:bg-slate-800/70'
                  }`}
                >
                  {/* Selected Indicator */}
                  {selected && (
                    <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-blue-500" />
                  )}

                  {/* Avatar */}
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg ${
                      selected
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-slate-600 to-slate-800'
                    }`}
                  >
                    {getInitials(user.name)}

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-[#111827] bg-emerald-400" />
                    )}
                  </div>

                  {/* User Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm font-semibold ${
                          selected
                            ? 'text-blue-300'
                            : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {user.name}
                      </p>

                      {user.lastMessageTime && (
                        <span className="shrink-0 text-[10px] text-slate-500">
                          {user.lastMessageTime}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-slate-500">
                        {user.lastMessage || (
                          <span className="italic text-slate-600">
                            No messages yet
                          </span>
                        )}
                      </p>

                      {!!user.unreadCount && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-blue-950/30">
                          {user.unreadCount > 99
                            ? '99+'
                            : user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/80 px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <svg
            className="h-3.5 w-3.5 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10V7a4 4 0 0 1 8 0v3"
            />
          </svg>

          <p className="text-[10px] text-slate-500">
            Your conversations are private
          </p>
        </div>
      </div>
    </aside>
  );
}
