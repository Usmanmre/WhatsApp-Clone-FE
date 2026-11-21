import useSocketConnection from '../hooks/useSocketConnection';

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
  const socketStatus = useSocketConnection();
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-200 bg-slate-400">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Messages</h2>
            <p className="mt-1 text-xs text-slate-500">
              {users?.length} conversations
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            Chat
          </span>
        </div>

        <div className="relative mt-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search people..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent conversations
        </p>

        {users?.map((user) => {
          const selected = selectedUserId === user._id;

          return (
            <button
              key={user._id}
              onClick={() => onSelectUser(user)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selected
                  ? 'bg-blue-50 ring-1 ring-blue-100'
                  : 'hover:bg-slate-50'
                }`}
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                {getInitials(user.name)}

                {user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>

                  <span className="shrink-0 text-[11px] text-slate-400">
                    {user.lastMessageTime}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-slate-500">
                    {user.lastMessage || user.email}
                  </p>

                  {!!user.unreadCount && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${socketStatus === 'connected'
                      ? 'bg-emerald-500'
                      : socketStatus === 'connecting'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                />
                <span className="text-xs text-slate-500">
                  {socketStatus === 'connected'
                    ? 'Connected'
                    : socketStatus === 'connecting'
                      ? 'Connecting...'
                      : socketStatus === 'error'
                        ? 'Connection error'
                        : 'Disconnected'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 p-4">
        <p className="text-center text-xs text-slate-400">
          Your conversations are private
        </p>
      </div>
    </aside>
  );
}
