"use client";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { MessageSquare, Users, MessageCircle, Archive, Settings, LogOut } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";

export const NavSidebar = () => {
  const authUser = useAuthStore((state: any) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const { activeTab, setActiveTab, selectedChatId } = useChatStore();
  const initials = authUser?.username?.charAt(0).toUpperCase() || "U";
  const { openSettings } = useUiStore();

  return (
    <div className={`md:w-20 w-full md:h-full h-16 flex md:flex-col flex-row items-center py-4 md:py-6 border-r md:border-b-0 border-t md:border-t-0 border-neutral-200/60 bg-[#eef3ee] justify-between z-40 fixed md:relative bottom-0 left-0 ${selectedChatId ? "hidden md:flex" : ""}`}>
      <div className="hidden md:flex w-12 h-12 rounded-full bg-black text-white items-center justify-center text-xl font-medium shadow-sm shrink-0">
        {authUser?.avatar_url ? (
          <img src={authUser.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex md:flex-col flex-row gap-2 md:gap-6 w-full items-center justify-around md:justify-start md:mt-8 flex-1">
        <NavIcon 
          icon={<MessageSquare size={22} />} 
          label="chats" 
          isActive={activeTab === 'chats'} 
          onClick={() => setActiveTab('chats')}
        />
        <NavIcon 
          icon={<Users size={22} />} 
          label="groups" 
          isActive={activeTab === 'groups'} 
          onClick={() => setActiveTab('groups')}
        />
        <NavIcon 
          icon={<MessageCircle size={22} />} 
          label="unread" 
          isActive={activeTab === 'unread'} 
          onClick={() => setActiveTab('unread')}
        />
        <NavIcon 
          icon={<Archive size={22} />} 
          label="archive" 
          isActive={activeTab === 'archive'} 
          onClick={() => setActiveTab('archive')}
        />
        <div className="md:hidden">
          <NavIcon icon={<LogOut size={22} />} label="logout" onClick={logout} />
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-4 mt-auto shrink-0 items-center">
        <NavIcon icon={<Settings size={22} />} label="settings" onClick={openSettings} />
        <NavIcon icon={<LogOut size={22} />} label="logout" onClick={logout} />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, label, isActive = false, onClick }: { icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative group p-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-white shadow-sm text-black" : "text-neutral-500 hover:bg-white/60 hover:text-black"} overflow-visible`}
    >
      {icon}
      <span className="hidden md:flex absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-[12px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl items-center">
        {label}
        {/* Pointer/Arrow */}
        <div className="absolute right-full w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-black"></div>
      </span>
    </button>
  );
};
