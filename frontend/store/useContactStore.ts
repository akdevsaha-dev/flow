import { create } from "zustand";
import api from "@/lib/axios";

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  username: string;
  isBlocked: boolean;
}

interface ContactStore {
  contacts: Contact[];
  searchResults: any[];
  isFetchingContacts: boolean;
  isSearching: boolean;
  fetchContacts: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  addContact: (contactId: string) => Promise<void>;
  updateNickname: (contactId: string, nickName: string) => Promise<void>;
  toggleBlockContact: (contactId: string, isBlocked: boolean) => Promise<void>;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  searchResults: [],
  isFetchingContacts: false,
  isSearching: false,

  fetchContacts: async () => {
    try {
      set({ isFetchingContacts: true });
      const res = await api.get("/contact/get-contacts");
      set({ contacts: res.data.contacts || [] });
    } catch (error) {
      const axiosError = error as any;
      console.error(
        "Failed to fetch contacts",
        axiosError.response?.data || axiosError.message,
      );
    } finally {
      set({ isFetchingContacts: false });
    }
  },

  searchUsers: async (query: string) => {
    try {
      set({ isSearching: true });
      const res = await api.get(`/auth/search-users?query=${query}`);
      set({ searchResults: res.data.users || [] });
    } catch (error) {
      console.error("Failed to search users", error);
    } finally {
      set({ isSearching: false });
    }
  },

  addContact: async (contactId: string) => {
    try {
      await api.post("/contact/add-contact", { contactId });
      // Refresh contacts list after adding
      const res = await api.get("/contact/get-contacts");
      set({ contacts: res.data.contacts || [] });
    } catch (error) {
      console.error("Failed to add contact", error);
      throw error;
    }
  },

  updateNickname: async (contactId: string, nickName: string) => {
    try {
      const res = await api.put("/contact/nickname", { contactId, nickName });
      const updatedContact = res.data.contact;

      set((state) => {
        const exists = state.contacts.some((c) => c.id === contactId);
        if (exists) {
          return {
            contacts: state.contacts.map((c) =>
              c.id === contactId ? updatedContact : c,
            ),
          };
        } else {
          return {
            contacts: [...state.contacts, updatedContact],
          };
        }
      });
    } catch (error) {
      console.error("Failed to update nickname", error);
      throw error;
    }
  },

  toggleBlockContact: async (contactId: string, isBlocked: boolean) => {
    try {
      const res = await api.put("/contact/block", { contactId, isBlocked });
      const updatedContact = res.data.contact;

      set((state) => {
        const exists = state.contacts.some((c) => c.id === contactId);
        if (exists) {
          return {
            contacts: state.contacts.map((c) =>
              c.id === contactId ? updatedContact : c,
            ),
          };
        } else {
          return {
            contacts: [...state.contacts, updatedContact],
          };
        }
      });
    } catch (error) {
      console.error("Failed to toggle block status", error);
      throw error;
    }
  },
}));
