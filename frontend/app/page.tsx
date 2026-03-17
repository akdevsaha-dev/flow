"use client";
import { Description } from "@/components/Description";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import gsap from "gsap";
import { DrawSVGPlugin, ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrollTrigger);

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Description />
    </div>
  );
}
