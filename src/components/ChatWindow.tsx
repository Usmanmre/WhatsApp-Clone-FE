
import type { ChatUser } from './UserList';

interface ChatWindowProps {
  selectedUser: ChatUser | null;
}

// const sampleMessages = [
//   {
//     id: 1,
//     text: 'Hey! How are you doing?',
//     time: '10:30 AM',
//     own: false,
//   },
//   {
//     id: 2,
//     text: "I'm good! Working on the chat application.",
//     time: '10:31 AM',
//     own: true,
//   },
//   {
//     id: 3,
//     text: 'Nice! Are you using Socket.IO?',
//     time: '10:32 AM',
//     own: false,
//   },
//   {
//     id: 4,
//     text: 'Yes, building it step by step.',
//     time: '10:33 AM',
//     own: true,
//   },
// ];

export default function ChatWindow({
  selectedUser,
}: ChatWindowProps) {
  if (!selectedUser) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-200 px-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
          💬
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Your conversations
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Select someone from your contacts to start a conversation.
        </p>
      </div>
    );
  }

  const initials = selectedUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <section className="flex h-full min-h-0 flex-col bg-slate-400">
      {/* Chat header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {selectedUser.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedUser.online ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              {selectedUser.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <button
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          title="More options"
        >
          •••
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
        <div className="flex justify-center">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] text-slate-400 shadow-sm">
            Today
          </span>
        </div>
        </div>

        {/* {sampleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[65%] ${
                message.own
                  ? 'rounded-br-sm bg-blue-600 text-white'
                  : 'rounded-bl-sm border border-slate-100 bg-white text-slate-800'
              }`}
            >
              <p className="text-sm leading-6">{message.text}</p>
              <p
                className={`mt-1 text-right text-[10px] ${
                  message.own ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message composer: visual only for now */}
      <div className="border-t border-slate-200 bg-slate-400 p-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-400 p-2">
          <input
            type="text"
            placeholder={`Message ${selectedUser.name}...`}
            // disabled
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
          />

          <button
            disabled
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          Real-time messaging will be connected next
        </p>
      </div>
    </section>
  );
}
