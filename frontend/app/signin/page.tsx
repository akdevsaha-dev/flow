import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen w-full bg-[#eef3ee] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements to match premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-200/50 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
        <Link 
          href="/" 
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-black transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-neutral-200"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Link>
      </div>

      <div className="z-10 w-full flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        <SignInForm />
      </div>

      <div className="absolute bottom-6 text-center w-full z-10 animate-in fade-in duration-1000 delay-300">
        <p className="text-sm text-neutral-500 font-light">
          Everything you need to stay connected with your people.
        </p>
      </div>
    </main>
  );
}
