"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { X, Settings, User, Info, LogOut, ChevronLeft, Save, Loader2, Mail, Hash, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type ViewState = "menu" | "profile" | "info";

export const SettingsPopup = () => {
  const { isSettingsOpen, closeSettings } = useUiStore();
  const authUser = useAuthStore((state: any) => state.authUser);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const router = useRouter();

  const [view, setView] = useState<ViewState>("menu");
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username || "");
      setAbout(authUser.about || "");
      setAvatarUrl(authUser.avatarUrl || "");
    }
  }, [authUser, isSettingsOpen]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const ok = await updateProfile({ username, about, avatar_url: avatarUrl });
      if (ok) {
        setView("menu");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "profile":
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setView("menu")}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-semibold text-neutral-900">Edit Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 transition-all text-sm font-medium"
                  required
                  minLength={3}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider ml-1">
                  About / Bio
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 transition-all text-sm font-medium resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-black text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5 active:scale-[0.98]"
                >
                  {isUpdating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case "info":
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setView("menu")}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-semibold text-neutral-900">Account Information</h3>
            </div>

            <div className="space-y-4">
              <InfoRow icon={<Mail size={16} />} label="Email address" value={authUser?.email} />
              <InfoRow icon={<Hash size={16} />} label="User ID" value={authUser?.id} />
              <InfoRow icon={<Calendar size={16} />} label="Joined" value={authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'} />
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50">
              <p className="text-[11px] text-neutral-500 leading-relaxed text-center italic">
                Your account information is private and never shared with other users.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold shadow-sm overflow-hidden">
                  {authUser?.avatarUrl ? (
                    <img
                      src={authUser.avatarUrl}
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
                onClick={() => setView("profile")}
              />
              <PopupItem
                icon={<Info size={18} />}
                label="Account information"
                description="View account details and preferences"
                onClick={() => setView("info")}
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
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onClick={closeSettings}
    >
      <div
        className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.18)] border border-neutral-100/80 p-6 md:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}

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
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors cursor-pointer group";

  const variantClasses =
    variant === "danger"
      ? "hover:bg-red-50"
      : "hover:bg-neutral-50";

  const labelClasses =
    variant === "danger"
      ? "text-[13px] font-medium text-red-600"
      : "text-[13px] font-medium text-neutral-900";

  const iconWrapperClasses =
    variant === "danger"
      ? "w-9 h-9 rounded-full flex items-center justify-center bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors"
      : "w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200 transition-colors";

  const descriptionClasses =
    "text-[11px] text-neutral-400 group-hover:text-neutral-500 transition-colors";

  return (
    <button className={`${base} ${variantClasses}`} onClick={onClick}>
      <div className={iconWrapperClasses}>{icon}</div>
      <div className="flex flex-col items-start translate-y-[-1px]">
        <span className={labelClasses}>{label}</span>
        {description && <span className={descriptionClasses}>{description}</span>}
      </div>
    </button>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) => (
  <div className="flex items-center justify-between p-3.5 bg-neutral-50/50 rounded-2xl border border-neutral-100/50">
    <div className="flex items-center gap-3">
      <div className="text-neutral-400">{icon}</div>
      <span className="text-xs font-medium text-neutral-500">{label}</span>
    </div>
    <span className="text-[13px] font-semibold text-neutral-900 truncate max-w-[180px]">
      {value || 'N/A'}
    </span>
  </div>
);
