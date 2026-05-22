import Link from "next/link";

type SidebarProps = {
  active: string;
  setActive: (value: string) => void;
};

export default function Sidebar({ active, setActive }: SidebarProps) {
  const menu = ["profile", "orders", "wishlist", "settings"];

  return (
    <aside className="hidden lg:flex w-64 min-h-screen flex-col justify-between px-8 py-10 border-r border-gray-100 bg-white">
      {/* TOP SECTION */}
      <div>
        <h1 className="text-[12px] tracking-[0.3em] uppercase text-gray-500 mb-10">
          My Account
        </h1>

        <nav className="flex flex-col gap-6 text-xs tracking-widest uppercase">
          {menu.map((item) => {
            const isActive = active === item;

            return (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`text-left transition-all duration-300 relative group ${
                  isActive
                    ? "text-black font-medium"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {/* ACTIVE INDICATOR */}
                <span
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full transition ${
                    isActive ? "bg-black" : "bg-transparent"
                  }`}
                />

                {item}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM LINK */}
      <div>
        <Link
          href="/"
          className="text-[11px] tracking-widest uppercase text-gray-400 hover:text-black transition"
        >
          Back to Shop
        </Link>
      </div>
    </aside>
  );
}
