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
  avatar: string | null;
  isBlocked: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  groupName: string | null;
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
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  setSelectedChat: (chatId: string | null) => void;
  setActiveTab: (tab: "chats" | "groups" | "unread" | "archive") => void;
  toggleArchiveChat: (chatId: string, isArchived: boolean) => Promise<void>;
  createChat: (participants: string[], groupName?: string) => Promise<void>;
  startChatWithContact: (contactId: string) => Promise<void>;
  sendMessageStub: (chatId: string, content: string, senderId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: [],
  selectedChatId: null,
  activeTab: "chats",
  isFetchingChats: false,
  isFetchingMessages: false,

  setActiveTab: (tab) => {
    set({ activeTab: tab });
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

      // Refresh chats to get full metadata
      await get().fetchChats();

      // Select the new chat
      get().setSelectedChat(newChatData.id);
      set({ activeTab: "chats" });
    } catch (error) {
      console.error("Failed to create chat", error);
      throw error;
    }
  },

  startChatWithContact: async (contactId: string) => {
    try {
      // 1. Check if chat already exists in local state
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

      // 2. Otherwise create new chat using the generic createChat
      await get().createChat([contactId]);
    } catch (error) {
      console.error("Failed to start chat with contact", error);
      throw error;
    }
  },

  sendMessageStub: (chatId: string, content: string, senderId: string) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(),
          chatId,
          senderId,
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },
}));
