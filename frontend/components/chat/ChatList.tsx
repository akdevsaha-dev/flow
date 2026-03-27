"use client";
import React, { useEffect, useState } from "react";
import { Search, Plus, Settings } from "lucide-react";
import { useChatStore, Chat } from "@/store/useChatStore";
import { useContactStore } from "@/store/useContactStore";
import { UserPlus, Users as UsersIcon, X, Check, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";

export const ChatList = () => {
  const [search, setSearch] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const fetchChats = useChatStore((state) => state.fetchChats);
  const chats = useChatStore((state) => state.chats);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const activeTab = useChatStore((state) => state.activeTab);

  const {
    contacts,
    fetchContacts,
    isFetchingContacts,
    searchUsers,
    searchResults,
    isSearching,
    addContact,
  } = useContactStore();
  const authUser = useAuthStore((state: any) => state.authUser);
  const { openSettings } = useUiStore();

  const [subModal, setSubModal] = useState<null | "group" | "contact">(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [contactSearchQuery, setContactSearchQuery] = useState("");

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (isNewChatModalOpen) {
      fetchContacts();
    } else {
      setSubModal(null);
      setGroupName("");
      setSelectedParticipants([]);
      setContactSearchQuery("");
    }
  }, [isNewChatModalOpen, fetchContacts]);

  useEffect(() => {
    if (subModal === "contact" && contactSearchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(contactSearchQuery);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [subModal, contactSearchQuery, searchUsers]);

  const createChat = useChatStore((state) => state.createChat);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length === 0) return;
    try {
      await createChat(selectedParticipants, groupName.trim());
      setIsNewChatModalOpen(false);
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const handleAddContact = async (contactId: string) => {
    try {
      await addContact(contactId);
      setSubModal(null);
    } catch (error) {
      console.error("Failed to add contact", error);
    }
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleContactClick = async (contactId: string) => {
    try {
      await useChatStore.getState().startChatWithContact(contactId);
      setIsNewChatModalOpen(false);
    } catch (error: any) {
      console.error("Failed to start chat", error);
    }
  };

  const filteredChats = chats.filter(chat => {
    if (activeTab === 'archive') {
      if (!chat.isArchived) return false;
    } else {
      if (chat.isArchived) return false;
      if (activeTab === 'groups' && !chat.isGroup) return false;
      if (activeTab === 'unread' && chat.unreadCount === 0) return false;
    }

    const name = chat.isGroup ? chat.groupName : chat.otherParticipants[0]?.name;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={`md:w-80 w-full h-full flex flex-col bg-[#eef3ee] border-r border-neutral-200/60 relative z-20 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-6 pb-2 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="hidden md:block text-2xl font-semibold text-black tracking-tight">
            Messages
          </h2>

          <div className="md:hidden flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-base font-semibold shadow-sm overflow-hidden">
              {authUser?.avatar_url ? (
                <img
                  src={authUser.avatar_url}
                  alt={authUser.username ?? "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (authUser?.username?.charAt(0).toUpperCase() ||
                  authUser?.email?.charAt(0).toUpperCase() ||
                  "U")
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black">
                {authUser?.username || "Your messages"}
              </span>
            </div>
          </div>

          <button
            onClick={openSettings}
            className="md:hidden p-2.5 rounded-full hover:bg-white/80 text-neutral-500 hover:text-black transition-colors border border-transparent hover:border-neutral-200 active:scale-95"
            aria-label="Open settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="relative flex items-center mt-1.5">
          <Search className="absolute left-4 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/60 focus:bg-white border focus:border-neutral-300 border-neutral-200/80 rounded-full py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-neutral-500 text-black shadow-sm placeholder:font-light"
          />
        </div>
      </div>

      {/* Middle: Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ scrollbarWidth: "none" }}>
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={selectedChatId === chat.id}
            onClick={() => setSelectedChat(chat.id)}
          />
        ))}
        {filteredChats.length === 0 && (
          <p className="text-center text-sm text-neutral-400 mt-10">No chats found.</p>
        )}
      </div>

      <button
        onClick={() => setIsNewChatModalOpen(true)}
        className="absolute bottom-6 right-6 w-13 h-13 bg-black text-white rounded-[1.25rem] flex items-center justify-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group z-30"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
          Create Chat
        </span>
      </button>

      {isNewChatModalOpen && (
        <div className="absolute inset-0 bg-[#eef3ee] z-40 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">
              {subModal === "group"
                ? "New Group"
                : subModal === "contact"
                  ? "New Contact"
                  : "New Chat"}
            </h2>
            <button
              onClick={() => {
                if (subModal) setSubModal(null);
                else setIsNewChatModalOpen(false);
              }}
              className="p-2 hover:bg-neutral-200 rounded-full transition-colors"
            >
              {subModal ? (
                <ChevronLeft size={20} className="text-neutral-500" />
              ) : (
                <X size={20} className="text-neutral-500" />
              )}
            </button>
          </div>

          {!subModal && (
            <>
              <div className="px-4 space-y-2">
                <button
                  onClick={() => setSubModal("group")}
                  className="w-full p-4 flex items-center gap-4 hover:bg-white/60 rounded-2xl transition-all group"
                >
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <UsersIcon size={20} />
                  </div>
                  <span className="font-medium text-black">New Group</span>
                </button>
                <button
                  onClick={() => setSubModal("contact")}
                  className="w-full p-4 flex items-center gap-4 hover:bg-white/60 rounded-2xl transition-all group"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <UserPlus size={20} />
                  </div>
                  <span className="font-medium text-black">New Contact</span>
                </button>
              </div>

              <div
                className="mt-6 flex-1 overflow-y-auto px-4 pb-6"
                style={{ scrollbarWidth: "none" }}
              >
                <h3 className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Available Contacts
                </h3>
                {isFetchingContacts ? (
                  <div className="flex justify-center p-8">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : contacts.length > 0 ? (
                  <div className="space-y-1">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-4 rounded-2xl cursor-pointer hover:bg-white/60 transition-all flex items-center gap-3 active:scale-[0.98]"
                        onClick={() => handleContactClick(contact.id)}
                      >
                        <div className="w-11 h-11 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium overflow-hidden">
                          {contact.avatar ? (
                            <img
                              src={contact.avatar}
                              alt={contact.name ?? "Contact"}
                              className="w-full h-full object-cover"
                            />
                          ) : contact.name ? (
                            contact.name.charAt(0).toUpperCase()
                          ) : (
                            "?"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-black truncate text-[15px]">
                            {contact.name}
                          </h4>
                          <p className="text-xs text-neutral-500 truncate font-light">
                            {contact.username}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-neutral-400 mt-10">
                    No contacts found.
                  </p>
                )}
              </div>
            </>
          )}

          {subModal === "group" && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="space-y-4 mb-6">
                <div className="px-2">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 block">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-white/60 border border-neutral-200 rounded-xl py-3 px-4 text-sm outline-none focus:bg-white focus:border-neutral-300 transition-all text-black"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <h3 className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Select Participants
                </h3>
                <div className="space-y-1">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => toggleParticipant(contact.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${selectedParticipants.includes(contact.id)
                        ? "bg-black text-white"
                        : "hover:bg-white/60 text-black"
                        }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-medium overflow-hidden shrink-0 ${selectedParticipants.includes(contact.id)
                          ? "bg-white/10"
                          : "bg-neutral-200 text-neutral-600"
                          }`}
                      >
                        {contact.avatar ? (
                          <img
                            src={contact.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : contact.name ? (
                          contact.name.charAt(0).toUpperCase()
                        ) : (
                          "?"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate text-[15px]">
                          {contact.name}
                        </h4>
                      </div>
                      {selectedParticipants.includes(contact.id) && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-2">
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedParticipants.length === 0}
                  className="w-full bg-black text-white font-semibold py-4 rounded-2xl shadow-lg hover:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Create Group ({selectedParticipants.length})
                </button>
              </div>
            </div>
          )}

          {subModal === "contact" && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="relative flex items-center mb-6">
                <Search
                  className="absolute left-4 text-neutral-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                  className="w-full bg-white/60 focus:bg-white border focus:border-neutral-300 border-neutral-200/80 rounded-full py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-neutral-500 text-black shadow-sm"
                  autoFocus
                />
              </div>

              <div
                className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                <h3 className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  {contactSearchQuery.trim()
                    ? "Search Results"
                    : "Type to find users"}
                </h3>

                {isSearching ? (
                  <div className="flex justify-center p-8">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => {
                      const isAlreadyContact = contacts.some(
                        (c) => c.id === user.id,
                      );
                      return (
                        <div
                          key={user.id}
                          className="p-4 bg-white/60 rounded-2xl flex items-center gap-3"
                        >
                          <div className="w-11 h-11 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium overflow-hidden shrink-0">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.username.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-black truncate text-[15px]">
                              {user.username}
                            </h4>
                            <p className="text-xs text-neutral-500 truncate font-light">
                              {user.email}
                            </p>
                          </div>
                          {isAlreadyContact ? (
                            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2">
                              Contact
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddContact(user.id)}
                              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-sm"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  contactSearchQuery.trim() && (
                    <p className="text-center text-sm text-neutral-400 mt-10">
                      No users found matching "{contactSearchQuery}".
                    </p>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChatItem = ({ chat, isActive, onClick }: { chat: Chat, isActive: boolean, onClick: () => void }) => {
  const name = chat.isGroup ? chat.groupName : chat.otherParticipants[0]?.name || "Unknown User";
  const avatar = chat.isGroup ? name?.charAt(0) : (chat.otherParticipants[0]?.avatar ? <img src={chat.otherParticipants[0]?.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : name?.charAt(0));

  const time = chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
  const unreadCount = chat.unreadCount || 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-[1.25rem] cursor-pointer transition-colors flex items-center gap-3 ${isActive ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]' : 'hover:bg-white/40'}`}
    >
      <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center text-lg font-medium overflow-hidden ${chat.isGroup ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-200/80 text-neutral-600'}`}>
        {typeof avatar === 'string' ? avatar.toUpperCase() : avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="font-medium text-black truncate text-[15px]">{name}</h3>
          <span className={`text-[11px] font-medium ${unreadCount > 0 ? 'text-black' : 'text-neutral-400'}`}>{time}</span>
        </div>
        <p className={`text-sm truncate pr-2 ${unreadCount > 0 ? 'text-black font-normal' : 'text-neutral-500 font-light'}`}>
          {chat.lastMessage || "No messages yet"}
        </p>
      </div>
      {unreadCount > 0 && (
        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm animate-in zoom-in duration-300">
          {unreadCount}
        </div>
      )}
    </div>
  );
};
