import { ArrowRight } from "lucide-react";

export const Marquee = () => {
  const words = ["Revolutionary", "Empowering", "Innovative"];

  return (
    <div className="marquee-wrapper h-[20vh] flex items-center bg-neutral-100 border-y border-neutral-300">
      <div className="marquee-content group">
        {[...words, ...words].map((word, index) => (
          <div
            key={index}
            className="flex items-center gap-12 px-6 cursor-default"
          >
            <span className="text-6xl md:text-8xl font-light uppercase tracking-widest text-neutral-400 transition-colors duration-500 group-hover:text-black">
              {word}
            </span>

            <ArrowRight
              size={48}
              strokeWidth={1}
              className="text-neutral-400 transition-colors duration-500 group-hover:text-black mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
