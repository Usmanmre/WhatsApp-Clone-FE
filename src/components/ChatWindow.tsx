
import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import type { ChatUser } from './UserList';

import {
  getConversationMessagesApi,
  sendMessageApi,
  type Message,
} from '../services/chat.api';

import { chatKeys } from '../api/chat.keys';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { usePresenceStore } from '../store/presence.store';

interface ChatWindowProps {
  selectedUser: ChatUser | null;
}

export default function ChatWindow({
  selectedUser,
}: ChatWindowProps) {
  const [content, setContent] = useState('');
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const onlineUsers = usePresenceStore((state) => state.onlineUsers);

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: chatKeys.conversation(
      user?._id ?? '',
      selectedUser?._id ?? '',
    ),
    queryFn: () => {
      if (!user?._id || !selectedUser?._id) {
        throw new Error('Missing conversation information');
      }

      return getConversationMessagesApi(
        selectedUser._id,
        user._id,
      );
    },
    enabled: !!user?._id && !!selectedUser?._id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({
      receiverId,
      senderId,
      content,
    }: {
      receiverId: string;
      senderId: string;
      content: string;
    }) =>
      sendMessageApi(receiverId, content, senderId),

    onSuccess: (newMessage, variables) => {
      queryClient.setQueryData<Message[]>(
        chatKeys.conversation(
          variables.senderId,
          variables.receiverId,
        ),
        (oldMessages = []) => {
          if (oldMessages.some((message) => message._id === newMessage._id)) {
            return oldMessages;
          }

          return [...oldMessages, newMessage];
        },
      );

      setContent('');
    },
  });

  const handleSend = async () => {
    if (
      !user?._id ||
      !selectedUser?._id ||
      !content.trim() ||
      sendMessageMutation.isPending
    ) {
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        senderId: user._id,
        receiverId: selectedUser._id,
        content: content.trim(),
      });
    } catch {
      // Mutation error is handled by TanStack Query.
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center bg-[#0b1120] text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700/60 bg-slate-800/60 shadow-xl">
          <svg
            className="h-9 w-9 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5m-8 6 3.5-3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3Z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-white">
          Your conversations
        </h2>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Select someone from your contacts and start a conversation.
        </p>
      </div>
    );
  }

  const isOnline = onlineUsers.has(selectedUser._id);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#0b1120] text-slate-100">

      {/* Chat Header */}
      <header className="flex items-center justify-between border-b border-slate-800/80 bg-[#111827]/90 px-5 py-4 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-base font-bold text-white shadow-lg shadow-blue-950/30">
            {selectedUser.name?.charAt(0).toUpperCase()}

            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[3px] border-[#111827] bg-emerald-400" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {selectedUser.name}
            </h2>

            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />

              <p
                className={`text-xs ${
                  isOnline ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="More options"
            className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="5" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="19" cy="12" r="1.7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 space-y-5 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(30,64,175,0.08),_transparent_55%)] px-4 py-6 sm:px-6">

        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-5 py-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
              <p className="text-sm text-slate-400">
                Loading conversation...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-5 text-center">
              <p className="font-medium text-red-400">
                Unable to load messages
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {error instanceof Error
                  ? error.message
                  : 'Something went wrong'}
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/60">
              <svg
                className="h-8 w-8 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-8 6 3.5-3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3Z"
                />
              </svg>
            </div>

            <h3 className="font-semibold text-slate-200">
              No messages yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Start the conversation with {selectedUser.name}.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.sender === user?._id;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isMine ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`group max-w-[85%] sm:max-w-[70%] ${
                    isMine ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isMine
                        ? 'rounded-br-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-950/20'
                        : 'rounded-bl-md border border-slate-700/60 bg-[#1e293b] text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.content}
                    </p>
                  </div>

                  <div
                    className={`mt-1.5 flex items-center gap-1.5 px-1 ${
                      isMine ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-[10px] font-medium text-slate-500">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {isMine && (
                      <svg
                        className="h-3.5 w-3.5 text-blue-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5 12 4 4L19 6"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Send Error */}
      {sendMessageMutation.isError && (
        <div className="border-t border-red-500/10 bg-red-500/5 px-5 py-2">
          <p className="text-xs text-red-400">
            {sendMessageMutation.error instanceof Error
              ? sendMessageMutation.error.message
              : 'Failed to send message'}
          </p>
        </div>
      )}

      {/* Message Composer */}
      <footer className="border-t border-slate-800/80 bg-[#111827] p-4 sm:px-6">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-700/80 bg-[#1e293b]/80 p-2 transition focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message..."
            rows={1}
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={
              !content.trim() ||
              sendMessageMutation.isPending
            }
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sendMessageMutation.isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
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
                  d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"
                />
              </svg>
            )}

            <span className="hidden sm:inline">
              {sendMessageMutation.isPending ? 'Sending' : 'Send'}
            </span>
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </footer>
    </div>
  );
}
