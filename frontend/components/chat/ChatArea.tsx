import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Send,
  MoreVertical,
  Phone,
  Video,
  MessageSquare,
  ChevronLeft,
  Edit2,
  Ban,
  Archive as ArchiveIcon,
  X,
  Check,
  CheckCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useContactStore } from "@/store/useContactStore";
import { useChatStore } from "@/store/useChatStore";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import { useSocket } from "@/app/providers/socket-provider";

export const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isGroupInfoModalOpen, setIsGroupInfoModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const socket = useSocket();
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const chats = useChatStore((state) => state.chats);
  const messages = useChatStore((state) => state.messages);
  const toggleArchiveChat = useChatStore((state) => state.toggleArchiveChat);
  const addMessageRealTime = useChatStore((state) => state.addMessageRealTime);
  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const lastSeenAt = useChatStore((state) => state.lastSeenAt);

  const contacts = useContactStore((state) => state.contacts);
  const updateNickname = useContactStore((state) => state.updateNickname);
  const toggleBlockContact = useContactStore(
    (state) => state.toggleBlockContact,
  );

  const activeChat = chats.find((c) => c.id === selectedChatId);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const allTypingUsers = useChatStore((state) => state.typingUsers);
  const otherTypingUsers = allTypingUsers.filter(userId => userId !== authUser?.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !selectedChatId) return;
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    socket.send(
      JSON.stringify({
        type: "mark_read",
        chatId: selectedChatId,
        messageId: lastMsg.id,
      })
    );
  }, [socket, selectedChatId, messages]);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !selectedChatId) {
      return;
    }
    const chatId = selectedChatId;
    socket.send(JSON.stringify({ type: "join_chat", chatId }));
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "leave_chat", chatId }));
      }
    };
  }, [socket, selectedChatId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !selectedChatId || !authUser) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
      // Real path: send via WebSocket; the server will persist and broadcast back
      socket.send(
        JSON.stringify({
          type: "send_message",
          chatId: selectedChatId,
          content: trimmed,
        })
      );
    } else {
      // Fallback: optimistic local append when socket is unavailable
      addMessageRealTime({
        id: crypto.randomUUID(),
        chatId: selectedChatId,
        senderId: authUser.id,
        content: trimmed,
        createdAt: new Date().toISOString(),
      });
    }

    setMessage("");
  };
  const handleTyping = () => {
    if (!socket || !selectedChatId || !authUser) return;
    socket.send(
      JSON.stringify({
        type: "typing_start",
        chatId: selectedChatId,
      }),
    );
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: "typing_stop",
          chatId: selectedChatId,
        }),
      );
    }, 1000);
  };

  if (!activeChat) {
    return (
      <div
        className={`flex-1 h-full flex-col items-center justify-center bg-white shadow-[-10px_0_30px_rgb(0,0,0,0.02)] z-30 md:flex hidden`}
      >
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <MessageSquare size={32} className="text-neutral-300" />
        </div>
        <h2 className="text-xl font-medium text-neutral-800">Your Messages</h2>
        <p className="text-neutral-500 mt-2 font-light">
          Select a chat to start messaging.
        </p>
      </div>
    );
  }

  const otherParticipant = activeChat.otherParticipants[0];
  const contactInfo = otherParticipant
    ? contacts.find((c) => c.id === otherParticipant.id)
    : null;
  const chatName = activeChat.isGroup
    ? activeChat.groupName
    : contactInfo?.name || otherParticipant?.name || "Unknown";
  const avatar = activeChat.isGroup ? (
    chatName?.charAt(0)
  ) : contactInfo?.avatar || otherParticipant?.avatar ? (
    <Image
      src={contactInfo?.avatar || otherParticipant?.avatar || ""}
      alt=""
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    chatName?.charAt(0)
  );

  const isOtherUserOnline = otherParticipant ? onlineUsers.has(otherParticipant.id) : false;

  const formatLastSeen = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "last seen just now";
      if (diffInSeconds < 3600) return `last seen ${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `last seen ${Math.floor(diffInSeconds / 3600)}h ago`;
      return `last seen ${date.toLocaleDateString()}`;
    } catch (e) {
      return "Offline";
    }
  };

  const lastSeenTime = otherParticipant ? lastSeenAt[otherParticipant.id] : null;
  const lastSeenText = lastSeenTime ? formatLastSeen(lastSeenTime) : null;

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await toggleArchiveChat(activeChat.id, !activeChat.isArchived);
      toast.success(
        activeChat.isArchived ? "Chat unarchived" : "Chat archived",
      );
    } catch (err: unknown) {
      let errorMessage = "Failed to archive chat";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsArchiving(false);
      setIsMenuOpen(false);
    }
  };

  const handleBlock = async () => {
    if (otherParticipant) {
      setIsBlocking(true);
      const isCurrentlyBlocked =
        contactInfo?.isBlocked || otherParticipant.isBlocked || false;
      try {
        await toggleBlockContact(otherParticipant.id, !isCurrentlyBlocked);
        toast.success(
          !isCurrentlyBlocked ? "Contact blocked" : "Contact unblocked",
        );
      } catch (err: unknown) {
        let errorMessage = "Failed to archive chat";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.error || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      } finally {
        setIsBlocking(false);
        setIsMenuOpen(false);
      }
    }
  };

  const handleUpdateNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otherParticipant && newNickname.trim()) {
      setIsUpdatingNickname(true);
      try {
        await updateNickname(otherParticipant.id, newNickname.trim());
        toast.success("Nickname updated");
        setIsNicknameModalOpen(false);
      } catch (err: unknown) {
        let errorMessage = "Failed to archive chat";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.error || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      } finally {
        setIsUpdatingNickname(false);
      }
    }
  };

  const openNicknameModal = () => {
    setNewNickname(contactInfo?.name || otherParticipant?.name || "");
    setIsNicknameModalOpen(true);
    setIsMenuOpen(false);
  };

  const memberList = (() => {
    if (!activeChat.isGroup) return [];
    const me = authUser
      ? {
        id: authUser.id,
        name: authUser.username || authUser.email || "You",
        username: authUser.username,
        avatar: authUser.avatar_url ?? null,
      }
      : null;
    const others = activeChat.otherParticipants ?? [];
    return me ? [me, ...others] : others;
  })();

  return (
    <div
      className={`flex-1 h-full flex-col bg-white shadow-[-10px_0_30px_rgb(0,0,0,0.02)] z-30 ${selectedChatId ? "flex" : "hidden md:flex"}`}
    >
      <div className="h-[88px] border-b border-neutral-100 flex items-center px-4 md:px-8 justify-between shrink-0 bg-white/80 backdrop-blur-md z-10 w-full">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1 mr-2">
          <button
            onClick={() => setSelectedChat(null)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-neutral-200/80 flex items-center justify-center text-neutral-600 font-medium text-base md:text-lg">
            {typeof avatar === "string" ? avatar?.toUpperCase() : avatar}
          </div>
          <div className="min-w-0">
            {activeChat.isGroup ? (
              <button
                type="button"
                onClick={() => setIsGroupInfoModalOpen(true)}
                className="font-semibold tracking-tight text-black text-lg text-left truncate w-full block"
              >
                {chatName}
              </button>
            ) : (
              <h2 className="font-semibold tracking-tight text-black text-lg truncate">
                {chatName}
              </h2>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="relative flex items-center justify-center w-2 h-2">
                {otherTypingUsers.length > 0 ? (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </>
                ) : isOtherUserOnline ? (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neutral-400"></span>
                )}
              </div>

              <div className="h-4 flex items-center min-w-0">
                {otherTypingUsers.length > 0 ? (
                  <span className="text-[13px] font-medium animate-pulse truncate">
                    {otherTypingUsers.length === 1
                      ? "typing..."
                      : `${otherTypingUsers.length} people typing...`}
                  </span>
                ) : activeChat.isGroup ? (
                  <span className="text-[13px] text-neutral-500 font-medium truncate">
                    {activeChat.otherParticipants.length + 1} members
                  </span>
                ) : isOtherUserOnline ? (
                  <span className="text-[13px] text-emerald-600 font-medium truncate">
                    Active now
                  </span>
                ) : lastSeenText ? (
                  <span className="text-[13px] text-neutral-400 font-medium truncate">
                    {lastSeenText}
                  </span>
                ) : (
                  <span className="text-[13px] text-neutral-400 font-medium truncate">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5 md:gap-2 text-neutral-400 shrink-0">
          <button className="p-2 md:p-3 hover:bg-neutral-100 hover:text-black rounded-full transition-all">
            <Phone size={20} />
          </button>
          <button className="p-2 md:p-3 hover:bg-neutral-100 hover:text-black rounded-full transition-all">
            <Video size={20} />
          </button>
          <div className="w-px h-6 bg-neutral-200 mx-1"></div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-full transition-all ${isMenuOpen ? "bg-neutral-100 text-black" : "hover:bg-neutral-100 hover:text-black"}`}
            >
              <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 overflow-hidden py-2 z-50">
                <button
                  onClick={handleArchive}
                  disabled={isArchiving}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-black transition-colors disabled:opacity-50"
                >
                  <ArchiveIcon size={16} />
                  {isArchiving
                    ? "Loading..."
                    : activeChat.isArchived
                      ? "Unarchive Chat"
                      : "Archive Chat"}
                </button>

                {!activeChat.isGroup && (
                  <>
                    <button
                      onClick={openNicknameModal}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-black transition-colors"
                    >
                      <Edit2 size={16} />
                      Update Nickname
                    </button>
                    <button
                      onClick={handleBlock}
                      disabled={isBlocking}
                      className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 text-sm font-medium transition-colors disabled:opacity-50 ${contactInfo?.isBlocked ||
                        (otherParticipant as any)?.isBlocked
                        ? "text-green-600 hover:text-green-700"
                        : "text-red-500 hover:text-red-600"
                        }`}
                    >
                      <Ban size={16} />
                      {isBlocking
                        ? "Loading..."
                        : contactInfo?.isBlocked ||
                          (otherParticipant as any)?.isBlocked
                          ? "Unblock Contact"
                          : "Block Contact"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-[#fafafa]/50"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pt-4">
          <div className="flex justify-center mb-4">
            <span className="bg-neutral-100 text-neutral-500 text-[11px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
              Today
            </span>
          </div>

          {messages.map((msg: any) => {
            const isMe = msg.senderId === authUser?.id;
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Read Receipt Logic:
            // Find the furthest message index any other participant has read
            const readIndices = activeChat.otherParticipants
              .map((p) => messages.findIndex((m) => m.id === p.lastReadMessageId))
              .filter((idx) => idx !== -1);
            const maxReadIndex =
              readIndices.length > 0 ? Math.max(...readIndices) : -1;

            const msgIndex = messages.findIndex((m) => m.id === msg.id);
            const isRead = isMe && msgIndex <= maxReadIndex;

            // Real-time Delivery Logic (using online status)
            const isAnyOtherOnline = activeChat.otherParticipants.some(p => onlineUsers.has(p.id));
            const isDelivered = isMe && !isRead && isAnyOtherOnline;

            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-[80%] ${isMe ? "self-end flex-row-reverse" : ""}`}
              >
                {!isMe && (
                  <div className="w-9 h-9 mt-auto rounded-full bg-neutral-200 shrink-0 flex items-center justify-center text-xs font-medium text-neutral-600">
                    {activeChat.isGroup
                      ? "U"
                      : typeof avatar === "string"
                        ? avatar.toUpperCase()
                        : avatar}
                  </div>
                )}
                <div
                  className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`${isMe ? "bg-black text-white rounded-3xl rounded-br-md shadow-md" : "bg-white border border-neutral-100 rounded-3xl rounded-bl-md shadow-sm"} px-5 py-3.5`}
                  >
                    <p
                      className={`${isMe ? "text-white/95 font-normal" : "text-neutral-800 font-medium"} text-[15px] leading-relaxed`}
                    >
                      {msg.content}
                    </p>
                  </div>
                  {isMe ? (
                    <div className="flex items-center gap-1.5 mr-1.5">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {time}
                      </span>
                      <div className="flex items-center">
                        {isRead ? (
                          <CheckCheck size={14} className="text-blue-500" />
                        ) : isDelivered ? (
                          <CheckCheck size={14} className="text-neutral-400" />
                        ) : (
                          <Check size={14} className="text-neutral-400" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-medium ml-2">
                      {time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} className="h-0" />
      </div>

      <div className="p-6 bg-white shrink-0 relative">
        {(contactInfo?.isBlocked || (otherParticipant as any)?.isBlocked) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex items-center justify-center p-6">
            <div className="bg-neutral-100 px-6 py-3 rounded-2xl flex items-center gap-3 border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Ban size={18} className="text-neutral-500" />
              <p className="text-sm font-medium text-neutral-600">
                This person is blocked
              </p>
              <button
                onClick={handleBlock}
                disabled={isBlocking}
                className="ml-2 text-sm font-semibold text-black hover:underline disabled:opacity-50"
              >
                {isBlocking ? "Wait..." : "Unblock"}
              </button>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSend}
          className={`max-w-4xl mx-auto flex items-center bg-neutral-100/70 rounded-4xl border-2 border-transparent focus-within:bg-white focus-within:border-neutral-200 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 pr-2 transition-all duration-300 ${contactInfo?.isBlocked || (otherParticipant as any)?.isBlocked
            ? "opacity-50 grayscale pointer-events-none"
            : ""
            }`}
        >
          <button
            type="button"
            className="p-3 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-200/50"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder={
              contactInfo?.isBlocked || (otherParticipant as any)?.isBlocked
                ? "Cannot send messages to blocked contacts"
                : "Write your message..."
            }
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            disabled={
              !!(contactInfo?.isBlocked || (otherParticipant as any)?.isBlocked)
            }
            className="flex-1 bg-transparent px-3 py-2 outline-none text-black placeholder:text-neutral-400 font-medium text-[15px]"
          />
          <button
            type="submit"
            disabled={
              !message.trim() ||
              !!(contactInfo?.isBlocked || (otherParticipant as any)?.isBlocked)
            }
            className="p-3.5 ml-2 bg-black text-white rounded-full hover:bg-neutral-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:bg-black disabled:hover:scale-100 transition-all flex items-center justify-center shadow-md"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>

      {isNicknameModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 min-h-screen w-full left-0 top-0">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-black tracking-tight">
                Update Nickname
              </h3>
              <button
                onClick={() => setIsNicknameModalOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateNickname}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="Enter a new nickname..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all text-[15px] font-medium placeholder:font-normal text-black"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNicknameModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNickname.trim() || isUpdatingNickname}
                  className="flex-1 px-4 py-3 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-black disabled:hover:scale-100 transition-all shadow-sm"
                >
                  {isUpdatingNickname ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeChat.isGroup && isGroupInfoModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 min-h-screen w-full left-0 top-0"
          onClick={() => setIsGroupInfoModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold text-black tracking-tight truncate">
                  {activeChat.groupName || "Group"}
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  {memberList.length} members
                </p>
              </div>
              <button
                onClick={() => setIsGroupInfoModalOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close group info"
              >
                <X size={20} />
              </button>
            </div>

            <div className="border-t border-neutral-100 pt-4 max-h-[55vh] overflow-y-auto pr-1">
              <div className="space-y-2">
                {memberList.map((m: any) => {
                  const isAdmin = m.id === (activeChat as any).createdBy;
                  const initials =
                    (m.name?.charAt?.(0) || m.username?.charAt?.(0) || "U").toUpperCase();
                  const secondary = m.email || m.username || "";
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold overflow-hidden shrink-0">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-semibold text-black truncate">
                            {m.name || m.username || "Unknown"}
                          </p>
                          {isAdmin && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black text-white shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                        {secondary && (
                          <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
                            {secondary}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
