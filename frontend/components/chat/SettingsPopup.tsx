"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { X, Settings, User, Info, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const SettingsPopup = () => {
  const { isSettingsOpen, closeSettings } = useUiStore();
  const authUser = useAuthStore((state: any) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  if (!isSettingsOpen) return null;

  const initials =
    authUser?.username?.charAt(0).toUpperCase() ||
    authUser?.email?.charAt(0).toUpperCase() ||
    "U";

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      closeSettings();
      router.push("/signin");
    }
  };

  const handleEditProfile = () => {
    // Placeholder for future profile route
    closeSettings();
  };

  const handleAccountInfo = () => {
    // Placeholder for future account route
    closeSettings();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onClick={closeSettings}
    >
      <div
        className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-neutral-100/80 p-6 md:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold shadow-sm overflow-hidden">
              {authUser?.avatar_url ? (
                <img
                  src={authUser.avatar_url}
                  alt={authUser.username ?? "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {authUser?.username || "Your account"}
              </p>
              <p className="text-xs text-neutral-500 truncate max-w-[160px] md:max-w-[220px]">
                {authUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors shrink-0"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-t border-neutral-100/80 pt-4 space-y-1">
          <PopupItem
            icon={<User size={18} />}
            label="Edit profile"
            description="Update your name, avatar and bio"
            onClick={handleEditProfile}
          />
          <PopupItem
            icon={<Info size={18} />}
            label="Account information"
            description="View account details and preferences"
            onClick={handleAccountInfo}
          />
        </div>

        <div className="border-t border-neutral-100/80 pt-4">
          <PopupItem
            icon={<LogOut size={18} />}
            label="Log out"
            description="Sign out from this device"
            onClick={handleLogout}
            variant="danger"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-1">
          <Settings size={13} className="text-neutral-400" />
          <span className="text-[11px] text-neutral-400 font-medium tracking-wide">
            Account &amp; preferences
          </span>
        </div>
      </div>
    </div>
  );
};

const PopupItem = ({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "danger";
}) => {
  const base =
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors cursor-pointer";

  const variantClasses =
    variant === "danger"
      ? "hover:bg-red-50 group"
      : "hover:bg-neutral-50 group";

  const labelClasses =
    variant === "danger"
      ? "text-[13px] font-medium text-red-600 group-hover:text-red-700"
      : "text-[13px] font-medium text-neutral-900";

  const iconWrapperClasses =
    variant === "danger"
      ? "w-9 h-9 rounded-full flex items-center justify-center bg-red-50 text-red-500 group-hover:bg-red-100"
      : "w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200";

  const descriptionClasses =
    "text-[11px] text-neutral-500 group-hover:text-neutral-600";

  return (
    <button className={`${base} ${variantClasses}`} onClick={onClick}>
      <div className={iconWrapperClasses}>{icon}</div>
      <div className="flex flex-col items-start">
        <span className={labelClasses}>{label}</span>
        {description && <span className={descriptionClasses}>{description}</span>}
      </div>
    </button>
  );
};

