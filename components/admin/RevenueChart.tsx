"use client";

import { useEffect, useRef } from "react";
import type { RevenueDay } from "@/../types/adminTypes";

export default function RevenueChart({ data }: { data: RevenueDay[] }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const valuesRef = useRef<(HTMLDivElement | null)[]>([]);

  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    data.forEach((d, i) => {
      const heightPct = (d.value / max) * 100;

      setTimeout(
        () => {
          const bar = barsRef.current[i];
          if (bar) bar.style.height = `${heightPct}%`;

          setTimeout(() => {
            const val = valuesRef.current[i];
            if (val) val.style.opacity = "1";
          }, 500);
        },
        80 + i * 80,
      );
    });
  }, [data, max]);

  return (
    <div className="relative bg-white border border-black/20 p-10">
      {/* Inner border */}
      <div className="absolute inset-2 border border-black/10 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-black/60 mb-1">
            MAISON · REVENUE
          </p>
          <p className="text-2xl font-light italic tracking-widest text-black">
            Seven Days
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] tracking-[0.3em] text-black/60 mb-1">
            TOTAL
          </p>
          <p className="text-3xl font-light text-black">
            ${(total / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/30 to-transparent my-6" />

      {/* Ornament */}
      <p className="text-center text-black/40 text-sm tracking-[0.4em] mb-6">
        — ✦ —
      </p>

      {/* Bars */}
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => {
          const isLast = i === data.length - 1;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
            >
              {/* Value */}
              <div
                ref={(el) => {
                  valuesRef.current[i] = el;
                }}
                className="text-xs font-light tracking-wide text-black/70 opacity-0 transition-opacity duration-500"
              >
                ${(d.value / 1000).toFixed(1)}k
              </div>

              {/* Bar wrapper */}
              <div className="w-full flex items-end flex-1">
                <div
                  ref={(el) => {
                    barsRef.current[i] = el;
                  }}
                  className={`w-full h-0 transition-all duration-700 ease-out ${
                    isLast ? "bg-black" : "bg-black/20"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-3 pt-2">
        {data.map((d, i) => {
          const isLast = i === data.length - 1;

          return (
            <div key={i} className="flex-1 text-center">
              <span
                className={`text-[10px] tracking-widest ${
                  isLast ? "text-black" : "text-black/40"
                }`}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-5 border-t border-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-black" />
          <span className="text-[10px] tracking-[0.3em] text-black/60">
            CURRENT DAY
          </span>
        </div>

        <button className="text-[10px] tracking-[0.3em] border border-black px-4 py-2 hover:bg-black hover:text-white transition">
          VIEW REPORT
        </button>
      </div>
    </div>
  );
}
