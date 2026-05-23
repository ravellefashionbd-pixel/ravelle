"use client";
import { ElementType } from "react";
import { TrendingUp, Eye, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
type StatCardProps = {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: ElementType;
};
function AdminStatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white border border-black/8 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[9px] tracking-[0.3em] text-black/40">{label}</p>
        <div className="w-8 h-8 bg-black/5 flex items-center justify-center">
          <Icon size={14} strokeWidth={1.5} className="text-black" />
        </div>
      </div>
      <p className="text-2xl font-light tracking-tight text-black">{value}</p>
      <div className="flex items-center gap-1">
        {positive
          ? <ArrowUpRight size={12} className="text-emerald-600" />
          : <ArrowDownRight size={12} className="text-red-500" />
        }
        <p className={`text-[10px] tracking-wider ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {change} vs last month
        </p>
      </div>
    </div>
  );
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const values = [38, 52, 61, 45, 70, 83, 67, 78, 91, 55, 88, 95];

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-xs tracking-[0.4em] text-black/40 mb-1">STORE</h2>
        <h1 className="text-2xl font-light tracking-wider text-black">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard label="CONVERSION RATE" value="3.42%"  change="+0.8%"  positive icon={TrendingUp} />
        <AdminStatCard label="BOUNCE RATE"     value="41.2%"  change="-5.1%"  positive icon={Eye} />
        <AdminStatCard label="AVG SESSION"     value="3m 22s" change="+12s"   positive icon={Globe} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-black/8 p-6">
        <p className="text-[9px] tracking-[0.35em] text-black/40 mb-6">SESSIONS PER MONTH</p>
        <div className="flex items-end gap-2 h-40">
          {values.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-black/80" style={{ height: `${h}%` }} />
              <p className="text-[8px] text-black/30">{months[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "TOP PAGE",     value: "/collections/summer-2025", stat: "12,840 views" },
          { label: "TOP PRODUCT",  value: "Merino Wool Coat",         stat: "3,210 views"  },
          { label: "TOP SOURCE",   value: "Organic Search",           stat: "48.2%"        },
          { label: "TOP COUNTRY",  value: "France",                   stat: "61.4%"        },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-black/8 p-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] tracking-[0.3em] text-black/30">{item.label}</p>
              <p className="text-[11px] tracking-[0.1em] text-black mt-1">{item.value}</p>
            </div>
            <p className="text-sm font-medium text-black">{item.stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
