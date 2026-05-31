import type { DashboardOrder } from "@/../types/adminTypes";

const statusStyles: Record<DashboardOrder["status"], string> = {
  SHIPPED: "text-[#2d7a4f]",
  PROCESSING: "text-[#c9a84c]",
  DELIVERED: "text-[#9e9892]",
};

export default function RecentOrders({ orders }: { orders: DashboardOrder[] }) {
  return (
    <div className="bg-white border border-[#e8e4de] rounded-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] tracking-[0.2em] text-[#9e9892] font-medium">
          RECENT ORDERS
        </p>
        <button className="text-[9px] tracking-[0.15em] text-[#c9a84c] hover:text-[#0a0a0a] transition-colors">
          ALL ORDERS
        </button>
      </div>

      <div className="divide-y divide-[#f0ece6]">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-3.5 group"
          >
            <div>
              <p className="text-[12px] font-medium text-[#0a0a0a] tracking-wide group-hover:text-[#c9a84c] transition-colors">
                {order.id}
              </p>
              <p className="text-[9px] tracking-[0.15em] text-[#9e9892] mt-0.5">
                {order.category}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-[13px] font-light text-[#0a0a0a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ৳ {order.amount.toLocaleString()}
              </p>
              <p
                className={`text-[9px] tracking-[0.15em] mt-0.5 font-medium ${statusStyles[order.status]}`}
              >
                {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
