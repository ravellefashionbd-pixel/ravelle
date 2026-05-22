"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = useMemo(
    () => [
      {
        image: "/fallback-1.jpg",
        collection: "The Silence",
        sub: "SS 2026 — New Arrivals",
        cta: "Explore Collection",
        index: "01",
      },
      {
        image: "/fallback-2.jpg",
        collection: "Noir Absolute",
        sub: "Exclusive Edition",
        cta: "Discover More",
        index: "02",
      },
      {
        image: "/fallback-3.jpg",
        collection: "PURE ESSENCE",
        sub: "Curated Selection",
        cta: "View Now",
        index: "03",
      },
    ],
    [],
  );

  const goTo = useCallback(
    (index: number) => {
      if (phase !== "idle" || index === current) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      setPrev(current);
      setPhase("exit");

      timerRef.current = setTimeout(() => {
        setCurrent(index);
        setPhase("enter");

        timerRef.current = setTimeout(() => {
          setPrev(null);
          setPhase("idle");
        }, 900);
      }, 600);
    },
    [phase, current],
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo, slides.length],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <section className="relative w-full h-[100svh] bg-black overflow-hidden">
      {/* SLIDES */}
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prev;

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-out
              ${isActive ? "opacity-100 scale-100" : ""}
              ${isPrev ? "opacity-0 scale-105" : ""}
              ${!isActive && !isPrev ? "opacity-0" : ""}
            `}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        );
      })}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-10" />

      {/* CONTENT */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="w-full px-[clamp(24px,6vw,100px)] pb-[clamp(60px,10vh,120px)]">
          <div className="grid md:grid-cols-12 items-end gap-6">
            {/* LEFT TEXT */}
            <div className="md:col-span-7">
              <span
                key={current + "sub"}
                className="block mb-3 text-[10px] tracking-[0.35em] text-white/50 uppercase animate-[fadeUp_0.8s_ease]"
              >
                {slides[current].sub}
              </span>

              <h2
                key={current + "title"}
                className="text-white text-[clamp(3rem,7vw,7rem)] font-light leading-none mb-5 animate-[fadeUp_0.9s_ease]"
              >
                {slides[current].collection}
              </h2>

              <button className="group flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-white">
                <span>{slides[current].cta}</span>
                <div className="w-7 h-[1px] bg-white transition-all duration-300 group-hover:w-11" />
              </button>
            </div>

            {/* RIGHT BIG INDEX */}
            <div className="hidden md:flex md:col-span-5 justify-end">
              <span className="text-[clamp(60px,10vw,120px)] text-white/10 font-light">
                {slides[current].index}
              </span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex justify-between items-center mt-10">
            {/* DOTS */}
            <div className="flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-[1px] transition-all duration-300
                    ${i === current ? "w-7 bg-white" : "w-2 bg-white/30"}
                  `}
                />
              ))}
            </div>

            {/* ARROWS */}
            <div className="flex gap-6 text-[11px] uppercase tracking-widest text-white/50">
              <button
                onClick={() =>
                  goTo((current - 1 + slides.length) % slides.length)
                }
              >
                Prev
              </button>
              <button onClick={next}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM ANIMATION */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
