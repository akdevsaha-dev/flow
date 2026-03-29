"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { NavSidebar } from "@/components/chat/NavSidebar";
import { ChatList } from "@/components/chat/ChatList";
import { ChatArea } from "@/components/chat/ChatArea";
import { useRouter } from "next/navigation";
import { SettingsPopup } from "@/components/chat/SettingsPopup";
import { useChatStore } from "@/store/useChatStore";

export default function ChatPage() {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [hasChecked, setHasChecked] = useState(false);
  const router = useRouter();
  const selectedChatId = useChatStore((state) => state.selectedChatId);

  useEffect(() => {
    checkAuth().finally(() => setHasChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (hasChecked && !authUser) {
      router.push("/signin");
    }
  }, [hasChecked, authUser, router]);

  if (!hasChecked || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef3ee]">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <>
      <div
        className={`flex h-screen w-full bg-[#eef3ee] overflow-hidden md:flex-row flex-col ${selectedChatId ? "pb-0" : "pb-16"} md:pb-0`}
      >
        <NavSidebar />
        <ChatList />
        <ChatArea />
      </div>
      <SettingsPopup />
    </>
  );
}
