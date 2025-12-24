import { create } from 'zustand';

export interface Message {
  id: string;
  project_id: string;
  sender: 'admin' | 'client';
  text: string;
  read: boolean;
  timestamp: string;
}

interface MessagesState {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  markAsRead: (messageIds: string[]) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages, error: null }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: !message.read ? state.unreadCount + 1 : state.unreadCount,
      error: null,
    })),

  markAsRead: (messageIds) =>
    set((state) => {
      const updatedMessages = state.messages.map((m) =>
        messageIds.includes(m.id) ? { ...m, read: true } : m
      );
      const markedCount = messageIds.length;
      return {
        messages: updatedMessages,
        unreadCount: Math.max(0, state.unreadCount - markedCount),
        error: null,
      };
    }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  decrementUnread: (count) =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - count),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
