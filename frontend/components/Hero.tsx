"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText, DrawSVGPlugin, ScrollToPlugin } from "gsap/all";

gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrollToPlugin);

import { Animate } from "./svgs/Animate";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

export const Hero = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const split = SplitText.create(".herotext", {
      type: "words, lines",
    });
    gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "+=10%",
        pin: true,
        scrub: 0.75,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.to(window, {
            scrollTo: "#description",
            duration: 1,
            ease: "power2.inOut",
          });
        },
      },
    });

    gsap.from(split.lines, {
      rotationX: -100,
      transformOrigin: "50% 50% -160px",
      opacity: 0,
      duration: 0.8,
      ease: "power3",
      stagger: 0.25,
    });

    gsap.from(".pop", {
      opacity: 0,
      y: -10,
      delay: 0.5,
      duration: 0.8,
      ease: "back.out",
      stagger: 0.3,
    });

    gsap.from(".heroslogan", {
      opacity: 0,
      delay: 1,
      duration: 1,
      ease: "elastic",
    });

    gsap.set("#animate-svg .draw", { fillOpacity: 0 });

    gsap.from("#animate-svg .draw", {
      drawSVG: "0%",
      duration: 1.5,
      stagger: 0.1,
      ease: "power2.out",
    });

    gsap.to("#animate-svg .draw", {
      fillOpacity: 1,
      duration: 0.3,
      delay: 1.2,
      stagger: 0.1,
      ease: "power2.inOut",
    });
    gsap.set(".slide > div:first-child", { opacity: 0 });
    gsap.fromTo(
      ".slide",
      {
        scaleX: 0.2,
        transformOrigin: "left center",
        opacity: 1,
      },
      {
        scaleX: 1,
        duration: 1,
        ease: "expo.out",
        onComplete: () => {
          gsap.to(".slide > div:first-child", {
            opacity: 1,
            duration: 0.01,
          });
        },
      },
    );
  }, []);
  return (
    <div id="hero" className="" ref={triggerRef}>
      <section className="panel md:flex">
        <div className="">
          <div className="herotext">Empower Connections with Flow.</div>
          <div className="heroslogan">
            Instant real-time communication, providing both visual connection
            and seamless collaboration.
          </div>
          <div className="features">
            <div className="md:w-40 w-35 text-sm md:text-md h-10 flex-center rounded-full bg-neutral-100 pop">
              High-performance
            </div>
            <div className="md:w-40 w-35 text-sm md:text-md h-10 flex-center rounded-full bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] pop">
              Revolutionary
            </div>
            <div className="md:w-40 w-35 text-sm md:text-md h-10 flex-center rounded-full bg-neutral-100 pop">
              Progressive
            </div>
          </div>
          <div className="flex gap-5 mt-10">
            <div className="slide flex-between h-11 rounded-full w-30 pl-4 px-1 bg-black text-white">
              <div>Try Out</div>
              <div className="bg-white text-black flex-center rounded-full h-9 w-9">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="slide flex-between h-11 rounded-full w-40 pl-5 px-1 bg-neutral-100 ">
              <div>Learn More</div>
              <div className="bg-white text-black flex-center rounded-full h-9 w-9">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="h hidden lg:block">
            <Animate />
          </div>
        </div>
      </section>
    </div>
  );
};
