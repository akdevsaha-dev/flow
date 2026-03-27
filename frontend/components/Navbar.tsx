"use client";
import { navLinks } from "@/constants";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Link from "next/link";

export const Navbar = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".section",
      { scaleX: 0.1, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        delay: 0.2,
        transformOrigin: "center",
        duration: 1,
        ease: "power2.out",
      },
    );
    gsap.from(".content", {
      opacity: 0,
      y: -10,
      delay: 0.5,
      duration: 0.8,
      ease: "back.out",
      stagger: 0.03,
    });
    gsap.fromTo(
      ".left",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, delay: 0.4, duration: 0.5, ease: "power1.inOut" },
    );
    gsap.from(".green", {
      opacity: 0,
      x: -40,
      delay: 0.2,
      ease: "power1",
    });
    gsap.from(".contact", {
      scale: 0.4,
      opacity: 0,
      delay: 0.8,
      duration: 0.4,
      ease: "power1.inOut",
    });
    gsap.fromTo(
      ".right",
      { scale: 0.8, opacity: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.in",
      },
    );
  }, []);
  return (
    <header>
      <nav>
        <div className="flex items-center gap-13">
          <div className="relative flex items-center justify-center w-6 h-6">
            <div className="w-6 green h-6 rounded-full bg-green-200"></div>
            <div className="absolute left -top-0.5 left-8 -translate-x-1/2 text-lg font-semibold">
              FLOW
            </div>
          </div>

          <div className="flex-center gap-1 contact bg-neutral-100 px-2 py-1 rounded-full">
            <div className="text-neutral-700 text-sm">Contact Us</div>
            <div className="h-2 w-2 rounded-full bg-green-200 mt-0.5"></div>
          </div>
        </div>
        <ul className="section">
          {navLinks.map(({ label }) => (
            <li className="content" key={label}>
              <a href="">{label}</a>
            </li>
          ))}
        </ul>
        <div className="right">
          <Link href={"/signin"} className="text-sm">
            Try Out
          </Link>
          <div className="bg-green-200 flex-center rounded-full h-7 w-7">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </nav>
    </header>
  );
};
