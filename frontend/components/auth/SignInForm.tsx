"use client";

import React, { useRef, useState } from "react";
import { InputBox } from "@/components/ui/InputBox";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const signin = useAuthStore((state) => state.signin);
  const isSigningIn = useAuthStore((state) => state.isSigningIn);
  const signinError = useAuthStore((state) => state.signinError);
  const router = useRouter();

  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signin({ email, password });
    if (success) {
      router.push("/chat");
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent implicit form submission
      passwordRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-2 text-black">Sign In</h1>
        <p className="text-neutral-500 text-sm">Welcome back chief, back to mission 🚀</p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <InputBox
          label="Email Address"
          type="email"
          id="email"
          placeholder="chief@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          required
        />
        {signinError && signinError.toLowerCase().includes("user") && (
          <p className="text-sm text-red-500 mt-1"> {signinError} </p>
        )}
        <InputBox
          ref={passwordRef}
          label="Password"
          type="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {signinError && signinError.toLowerCase().includes("password") && (
          <p className="text-sm text-red-500 mt-1">{signinError}</p>
        )}

        <button
          type="submit"
          disabled={isSigningIn}
          className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-6"
        >
          {isSigningIn ? <Loader2 className="animate-spin mr-2" size={20} /> : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-black font-medium hover:underline">
          Sign up today
        </Link>
      </div>
    </div>
  );
};
