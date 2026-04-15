import { create } from "zustand";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  about?: string | null;
  avatar_url?: string | null;
}

interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  signinError: string | null;
  signupError: string | null;
  checkAuth: () => Promise<void>;
  signup: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  signin: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: {
    username?: string;
    about?: string;
    avatar_url?: string;
  }) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningIn: false,
  isSigningUp: false,
  isLoggingOut: false,
   signinError: null,
   signupError: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true, signinError: null, signupError: null });
      const res = await api.get("/auth/check-auth");
      set({ authUser: res.data.user || res.data });
    } catch (error) {
      console.log("Failed to check auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      set({ isSigningUp: true, signupError: null });
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data.user, signupError: null });
      toast.success(`Account created! Signed up as ${res.data.user.email}`);
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Sign up failed";
      set({ signupError: message });
      toast.error(message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin: async (data: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      set({ isSigningIn: true, signinError: null });
      const res = await api.post("/auth/signin", data);
      set({ authUser: res.data.user, signinError: null });
      toast.success(`Welcome back! Signed in as ${res.data.user.email}`);
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Sign in failed";
      set({ signinError: message });
      toast.error(message);
      return false;
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await api.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      return true;
    } catch (error: any) {
      toast.error("Failed to log out");
      console.log("Cannot log out", error);
      return false;
    } finally {
      set({ isLoggingOut: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.patch("/users/profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
      return true;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile";
      toast.error(message);
      return false;
    }
  },
}));
