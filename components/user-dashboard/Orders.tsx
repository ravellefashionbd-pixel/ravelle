"use client";

import { useEffect, useState } from "react";
import { getOrders } from "../../app/actions/user-dashboard-actions/getOrders";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  product_image: string | null;
  size: string;
  color: string | null;
};

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string | null;
  order_items: OrderItem[];
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-600";
    case "processing":
      return "bg-yellow-100 text-yellow-600";
    case "shipped":
      return "bg-blue-100 text-blue-600";
    case "cancelled":
      return "bg-red-100 text-red-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getOrders();
      if (result.error) setError(result.error);
      else setOrders(result.data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 p-5 md:p-8 shadow-sm">
      <h3 className="uppercase text-xs tracking-[0.3em] text-gray-500 mb-6">
        Orders
      </h3>

      {loading && (
        <p className="text-xs text-gray-400 uppercase tracking-widest py-10 text-center animate-pulse">
          Loading orders...
        </p>
      )}

      {!loading && error && (
        <p className="text-xs text-red-400 uppercase tracking-widest py-10 text-center">
          Failed to load orders.
        </p>
      )}

      {!loading && !error && (!orders || orders.length === 0) && (
        <p className="text-xs text-gray-400 uppercase tracking-widest py-10 text-center">
          No orders yet.
        </p>
      )}

      {!loading && orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-100 p-4 md:p-5 hover:bg-gray-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span
                  className={`w-fit px-3 py-1 text-[10px] uppercase tracking-widest rounded-full ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-semibold">
                  ৳{Number(order.total_amount).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                {order.order_items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-xs text-gray-500"
                  >
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-8 h-8 object-cover border border-gray-100"
                      />
                    )}
                    <span>{item.product_name}</span>
                    <span className="text-gray-300">|</span>
                    <span>{item.size}</span>
                    {item.color && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{item.color}</span>
                      </>
                    )}
                    <span className="text-gray-300">|</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.created_at && (
                <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-3">
                  {formatDate(order.created_at)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
