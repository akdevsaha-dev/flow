"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getWebSocketUrl } from "@/lib/ws-url";
import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const authUser = useAuthStore((s) => s.authUser);

  useEffect(() => {
    if (!authUser) {
      setSocket(null);
      return;
    }

    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        const store = useChatStore.getState();

        switch (message.type) {
          case "online_users_list":
            // Initial snapshot: which users are currently connected
            store.setOnlineUsers(message.data.userIds);
            break;

          case "user_online":
            store.setUserOnline(message.data.userId);
            break;

          case "user_offline":
            store.setUserOffline(message.data.userId, message.data.lastSeenAt);
            break;

          case "new_message":
            // Append the message to the active chat and update the chat list preview
            store.addMessageRealTime(message.data);
            break;

          case "message_read":
            // Track who has read up to which message (for future read-receipt UI)
            store.markMessageReadLocally(
              message.data.chatId,
              message.data.messageId,
              message.data.userId
            );
            break;

          case "user_typing_start":
            store.startTyping(message.data.userId);
            break;

          case "user_typing_stop":
            store.stopTyping(message.data.userId);
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    ws.onclose = () => {
      setSocket(null);
    };

    ws.onerror = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [authUser?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
