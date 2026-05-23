import { TrendingUp, TrendingDown } from "lucide-react";
import type { StatCard } from "@/../types/adminTypes";

export default function StatCards({ cards }: { cards: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const isUp = card.change >= 0;
        return (
          <div
            key={card.label}
            className="stat-card bg-white border border-[#e8e4de] rounded-sm p-5 cursor-default"
          >
            <p className="text-[9px] tracking-[0.2em] text-[#9e9892] font-medium leading-relaxed mb-3">
              {card.label}
            </p>
            <p
              className="text-2xl sm:text-3xl font-light text-[#0a0a0a] leading-none mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {card.value}
            </p>
            <div
              className={`flex items-center gap-1 text-[9px] tracking-[0.1em] font-medium ${isUp ? "text-[#2d7a4f]" : "text-[#c0392b]"}`}
            >
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>
                {isUp ? "▲" : "▼"} {Math.abs(card.change)}% VS LAST MONTH
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
