import type { ActivityItem } from "@/../types/adminTypes";

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="bg-white border border-[#e8e4de] rounded-sm p-5">
      <p className="text-[9px] tracking-[0.2em] text-[#9e9892] font-medium mb-5">
        ACTIVITY
      </p>

      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 pb-4 relative">
            {i < items.length - 1 && (
              <div className="absolute left-[5px] top-3 bottom-0 w-px bg-[#e8e4de]" />
            )}
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] border-2 border-white ring-1 ring-[#0a0a0a] flex-shrink-0 mt-0.5 relative z-10" />
            <div>
              <p className="text-[12px] text-[#0a0a0a] leading-snug">
                {item.message}
              </p>
              <p className="text-[9px] tracking-[0.15em] text-[#9e9892] mt-1">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
