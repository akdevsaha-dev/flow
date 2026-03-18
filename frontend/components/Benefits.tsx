"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpFromLine, ArrowUpRight } from "lucide-react";
import { benefitsData } from "../constants";

gsap.registerPlugin(ScrollTrigger);

export const BenefitSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 100%",
            scrub: 1,
          },
        });

        tl.fromTo(
          ".benefit-row",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.75 },
          0,
        );

        tl.fromTo(
          ".left-card",
          { x: "50%" },
          { x: 0, duration: 1, delay: 0.5, stagger: 0.75, ease: "power2.out" },
          0,
        );

        tl.fromTo(
          ".right-card",
          { x: "-50%" },
          { x: 0, duration: 1, delay: 0.5, stagger: 0.75, ease: "power2.out" },
          0,
        );
      });

      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 100%",
            scrub: 1,
          },
        });

        tl.fromTo(
          ".benefit-row",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.75 },
          0,
        );

        tl.fromTo(
          ".left-card",
          { y: "50%" },
          { y: 0, duration: 1, delay: 0.5, stagger: 0.75, ease: "power2.out" },
          0,
        );

        tl.fromTo(
          ".right-card",
          { y: "-50%" },
          { y: 0, duration: 1, delay: 0.5, stagger: 0.75, ease: "power2.out" },
          0,
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      id="benefit"
      className="min-h-screen overflow-hidden pb-16 lg:pb-32"
    >
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0 mt-[5vh] lg:mt-[10vh] px-6 lg:px-10">
        <div className="flex items-center gap-2 border border-neutral-200 py-1 px-2 rounded-full self-start lg:self-auto">
          <div className="h-6 w-6 bg-neutral-200 flex items-center justify-center rounded-full">
            <ArrowUpFromLine size={13} />
          </div>
          <div className="text-sm">unlocking value</div>
        </div>

        <div className="text-5xl md:text-6xl lg:text-7xl font-light text-center">
          Our Benefits
        </div>

        <div className="flex items-center gap-1 cursor-pointer group self-end lg:self-auto">
          Explore All{" "}
          <span className="bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] px-3 py-1 rounded-full transition-transform group-hover:scale-105">
            Benefits
          </span>
          <ArrowUpRight
            className="text-neutral-800 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            size={20}
          />
        </div>
      </div>

      <div className="flex flex-col gap-12 lg:gap-8 mt-12 lg:mt-16 items-center w-full px-4 lg:px-10">
        {benefitsData.map((item, index) => (
          <div
            key={index}
            className="benefit-row flex flex-col lg:flex-row justify-center items-center lg:items-stretch w-full max-w-6xl"
          >
            <div className="left-card  shadow-md relative z-0 flex flex-col sm:flex-row justify-between items-center p-8 lg:pl-8 lg:pr-16 lg:py-6 w-full lg:flex-1 min-h-48 rounded-4xl bg-white will-change-transform text-center sm:text-left gap-4 sm:gap-0">
              <div className="h-12 w-12 flex items-center justify-center shrink-0 rounded-full bg-black text-white">
                <item.icon />
              </div>
              <div className="w-full sm:max-w-[20rem] sm:ml-6 flex flex-col items-center sm:items-start">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="right-card  relative z-20 shadow-[0_0_30px_rgba(0,0,0,0.08)] -mt-8 lg:-ml-12 lg:mt-0  py-8 lg:py-0 px-6 lg:pl-16 bg-[#eff0ee] w-full lg:flex-1 min-h-48 rounded-4xl flex flex-col justify-center items-center text-center lg:pr-6 will-change-transform">
              <div className="text-neutral-500 text-sm uppercase tracking-wider">
                {item.rightSubtitle}
              </div>
              <div className="mt-2 text-3xl font-light">{item.rightTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
