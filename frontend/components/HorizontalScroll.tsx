"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export const HorizontalScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 1,
          snap: sections.length > 1 ? 1 / (sections.length - 1) : undefined,
          end: () => "+=" + el.offsetWidth,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div className="horizontal flex w-[300vw]">
        <section className="panel w-screen h-screen shrink-0 flex items-center justify-center ">
          <div className="h-screen  w-full flex-center ">
            <div className="w-[90vw] md:w-6xl md:max-w-6xl bg-[#bfd3c23e] flex flex-col md:flex-row h-[85vh] md:h-[80vh] py-8 md:py-0 rounded-4xl overflow-hidden">
              <div className="flex-1 col-center gap-4 md:gap-6 px-4 md:px-0">
                {/* Heading */}
                <div className="text-3xl md:text-5xl max-w-full md:max-w-md leading-tight text-center md:text-left px-2 md:px-0">
                  <span className="bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] px-3 rounded-full">
                    Connected
                  </span>{" "}
                  in real <br />
                  time,{" "}
                  <span className="bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] px-3 rounded-full">
                    every time.
                  </span>
                </div>

                <p className="max-w-sm px-6 md:pl-1 text-base md:text-lg text-gray-500 leading-relaxed text-center md:text-left">
                  Stripping away the noise to focus on what matters. We use
                  neutral palettes and bold typography to create interfaces that
                  are as intuitive as they are beautiful.
                </p>
              </div>
              <div className="flex-1 flex-center w-full md:w-3xl mt-6 md:mt-0 p-4 shrink">
                <Image
                  src={"/friends.svg"}
                  alt="con"
                  height={400}
                  width={200}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="panel w-screen h-screen shrink-0 bg-slate-100 flex items-center justify-center">
          <div className="h-screen w-full flex-center ">
            <div className="w-[90vw] md:w-6xl md:max-w-6xl bg-[#bfd3c23e] flex flex-col md:flex-row h-[85vh] md:h-[80vh] py-8 md:py-0 rounded-4xl overflow-hidden">
              <div className="flex-1 col-center gap-4 md:gap-6 px-4 md:px-0">
                {/* Heading */}
                <div className="text-3xl md:text-5xl max-w-full md:max-w-md leading-tight text-center md:text-left px-2 md:px-0">
                  Zero noise only
                  <br />
                  pure,{" "}
                  <span className="bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] px-3 rounded-full">
                    connection.
                  </span>
                </div>

                <p className="max-w-sm px-6 md:pl-1 text-base md:text-lg text-gray-500 leading-relaxed text-center md:text-left">
                  We’ve stripped away the algorithmic clutter. No ads, no
                  distractions—just a clean, neutral interface designed for
                  meaningful interaction.
                </p>
              </div>
              <div className="flex-1 flex-center w-full md:w-3xl mt-6 md:mt-0 p-4 shrink">
                <Image
                  src={"/no-noise.svg"}
                  alt="con"
                  height={400}
                  width={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="panel w-screen h-screen shrink-0 bg-neutral-50 flex items-center justify-center">
          <div className="h-screen w-full flex-center ">
            <div className="w-[90vw] md:w-6xl md:max-w-6xl bg-[#bfd3c23e] flex flex-col md:flex-row h-[85vh] md:h-[80vh] py-8 md:py-0 rounded-4xl overflow-hidden">
              <div className="flex-1 col-center gap-4 md:gap-6 px-4 md:px-0">
                <div className="text-3xl md:text-5xl max-w-full md:max-w-md leading-tight text-center md:text-left px-2 md:px-0">
                  Digital spaces for
                  <br />
                  every inner,{" "}
                  <span className="bg-linear-to-r from-[#e4f2b1] via-[#d9f5aa] to-[#bfdbeb] px-3 rounded-full">
                    circle.
                  </span>
                </div>

                <p className="max-w-sm px-6 md:pl-1 text-base md:text-lg text-gray-500 leading-relaxed text-center md:text-left">
                  From late-night brainstorms to casual hangouts, create private
                  rooms that act as your group’s permanent digital headquarters.
                  One app, infinite ways to belong.
                </p>
              </div>
              <div className="flex-1 flex-center w-full md:w-3xl mt-6 md:mt-0 p-4 shrink">
                <Image src={"/group.svg"} alt="con" height={400} width={400} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
