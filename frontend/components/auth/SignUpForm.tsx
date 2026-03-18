"use client";

import React, { useRef, useState } from "react";
import { InputBox } from "@/components/ui/InputBox";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = useAuthStore((state) => state.signup);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup({ username, email, password });
    if (success) {
      router.push("/chat");
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      emailRef.current?.focus();
    }
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-2 text-black">Sign Up</h1>
        <p className="text-neutral-500 text-sm mb-1">Texting just got better. Sign up today.</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <InputBox
          label="Username"
          type="text"
          id="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleUsernameKeyDown}
          required
        />
        <InputBox
          ref={emailRef}
          label="Email Address"
          type="email"
          id="email"
          placeholder="chief@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          required
        />
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

        <button
          type="submit"
          disabled={isSigningUp}
          className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center font-medium hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-6"
        >
          {isSigningUp ? <Loader2 className="animate-spin mr-2" size={20} /> : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/signin" className="text-black font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
