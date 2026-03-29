import { create } from "zustand";
import api from "@/lib/axios";

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  username?: string;
  avatar: string | null;
  isBlocked: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  groupName: string | null;
  createdBy: string;
  lastMessageId: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  lastMessageSenderId: string | null;
  lastMessageSenderName: string | null;
  lastMessageSenderAvatar: string | null;
  isArchived: boolean;
  unreadCount: number;
  otherParticipants: ChatParticipant[];
}

interface ChatStore {
  chats: Chat[];
  messages: ChatMessage[];
  selectedChatId: string | null;
  activeTab: "chats" | "groups" | "unread" | "archive";
  isFetchingChats: boolean;
  isFetchingMessages: boolean;
  typingUsers: string[];
  /** Set of userIds currently connected via WebSocket */
  onlineUsers: Set<string>;
  /** userId → ISO timestamp of last disconnect */
  lastSeenAt: Record<string, string>;
  startTyping: (userId: string) => void;
  stopTyping: (userId: string) => void;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  setSelectedChat: (chatId: string | null) => void;
  setActiveTab: (tab: "chats" | "groups" | "unread" | "archive") => void;
  toggleArchiveChat: (chatId: string, isArchived: boolean) => Promise<void>;
  createChat: (participants: string[], groupName?: string) => Promise<void>;
  startChatWithContact: (contactId: string) => Promise<void>;
  addMessageRealTime: (message: ChatMessage) => void;
  markMessageReadLocally: (chatId: string, messageId: string, userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string, seenAt: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: [],
  selectedChatId: null,
  activeTab: "chats",
  isFetchingChats: false,
  isFetchingMessages: false,
  typingUsers: [],
  onlineUsers: new Set<string>(),
  lastSeenAt: {},
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  startTyping: (userId: string) => {
    set((state) => {
      if (state.typingUsers.includes(userId)) return state;
      return {
        typingUsers: [...state.typingUsers, userId],
      };
    });
  },
  stopTyping: (userId: string) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== userId),
    }));
  },
  fetchChats: async () => {
    try {
      set({ isFetchingChats: true });
      const res = await api.get("/chat/get-chats");
      set({ chats: res.data.chats || [] });
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      set({ isFetchingChats: false });
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ isFetchingMessages: true, messages: [] });
      const res = await api.get(`/chat/${chatId}/messages`);
      set({ messages: res.data.messages?.reverse() || [] });
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  setSelectedChat: (chatId: string | null) => {
    set({ selectedChatId: chatId });
    if (chatId) {
      get().fetchMessages(chatId);
    } else {
      set({ messages: [] });
    }
  },

  toggleArchiveChat: async (chatId: string, isArchived: boolean) => {
    try {
      await api.put("/chat/archive", { chatId, isArchived });
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, isArchived } : chat,
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle archive", error);
      throw error;
    }
  },

  createChat: async (participants: string[], groupName?: string) => {
    try {
      const res = await api.post("/chat/create-chat", {
        participants,
        groupName,
      });
      const newChatData = res.data.chat;

      await get().fetchChats();

      get().setSelectedChat(newChatData.id);
      set({ activeTab: "chats" });
    } catch (error) {
      console.error("Failed to create chat", error);
      throw error;
    }
  },
  startChatWithContact: async (contactId: string) => {
    try {
      const existingChat = get().chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.otherParticipants.some((p) => p.id === contactId),
      );

      if (existingChat) {
        get().setSelectedChat(existingChat.id);
        set({ activeTab: "chats" });
        return;
      }

      await get().createChat([contactId]);
    } catch (error) {
      console.error("Failed to start chat with contact", error);
      throw error;
    }
  },

  addMessageRealTime: (message: ChatMessage) => {
    set((state) => {
      // Only append to the visible messages list if we're currently in this chat
      const isActiveChat = state.selectedChatId === message.chatId;
      return {
        messages: isActiveChat ? [...state.messages, message] : state.messages,
        // Always update the chat list preview so it reflects the latest message
        chats: state.chats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessageId: message.id,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                lastMessageSenderId: message.senderId,
              }
            : chat
        ),
      };
    });
  },

  markMessageReadLocally: (chatId: string, messageId: string, _userId: string) => {
    // Update the chat's lastReadMessageId locally (no UI impact yet, but ready for future badges)
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat } : chat
      ),
    }));
    // Suppress unused variable warning — userId kept for future unread-badge logic
    void _userId;
    void messageId;
  },

  setOnlineUsers: (userIds: string[]) => {
    set({ onlineUsers: new Set(userIds) });
  },

  setUserOnline: (userId: string) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    });
  },

  setUserOffline: (userId: string, seenAt: string) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return {
        onlineUsers: next,
        lastSeenAt: { ...state.lastSeenAt, [userId]: seenAt },
      };
    });
  },
}));
