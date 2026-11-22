export const chatKeys = {
  all: ['chat'] as const,

  conversation: (
    currentUserId: string,
    otherUserId: string,
  ) =>
    [
      ...chatKeys.all,
      'conversation',
      currentUserId,
      otherUserId,
    ] as const,
};