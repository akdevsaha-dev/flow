"use client";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin, ScrollTrigger, SplitText } from "gsap/all";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

export const Description = () => {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.normalizeScroll(true);

      const split = new SplitText(textRef.current, {
        type: "words",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=120%",
          pin: containerRef.current,
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        ".ball",
        {
          motionPath: {
            path: [
              { x: 100, y: 100 },
              { x: 200, y: 50 },
              { x: 300, y: 400 },
              { x: 200, y: 600 },
              { x: 900, y: 150 },
            ],
            curviness: 2,
            autoRotate: true,
          },
          duration: 4,
        },
        0,
      );
      tl.from(
        split.words,
        {
          color: "#9ca3af",
          opacity: 0.3,
          stagger: 0.1,
          duration: 1,
        },
        0,
      );
    },
    { scope: triggerRef },
  );

  return (
    <div ref={triggerRef}>
      <div
        id="desc"
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        <div className="desc-text z-50 relative" ref={textRef}>
          Experience conversations like never before with Flow. Instant,
          real-time messaging that keeps you connected wherever you are. Share
          ideas, collaborate seamlessly, and stay in the flow with a chat
          platform designed for speed, clarity, and effortless connection.
        </div>

        <Image
          src={"/move.svg"}
          alt="move"
          height={100}
          width={100}
          className="absolute top-0 left-0  rounded-full ball"
        />
      </div>
    </div>
  );
};
