"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setHasChecked(true));
  }, [checkAuth]);

  if (!hasChecked || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef3ee]">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#eef3ee] p-4 text-black">
      <h1 className="text-4xl font-medium tracking-tight mb-4">Chat</h1>
      {authUser ? (
        <p className="text-xl">Welcome @{authUser.username}</p>
      ) : (
        <p className="text-xl">Please sign in to view the chat.</p>
      )}
    </div>
  );
}
