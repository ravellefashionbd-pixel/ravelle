type SidebarProps = {
  active: string;
  setActive: (value: string) => void;
};

export default function MobileNav({ active, setActive }: SidebarProps) {
  const menu = ["profile", "orders", "wishlist", "settings"];

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-3 z-50 px-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-gray-200/70 shadow-xl rounded-2xl flex overflow-hidden">
        {menu.map((item) => {
          const isActive = active === item;

          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              className="relative flex-1 py-3 flex flex-col items-center justify-center group active:scale-95 transition"
            >
              <span
                className={`absolute inset-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-black"
                    : "bg-transparent group-active:bg-gray-100"
                }`}
              />

              <span
                className={`relative text-[10px] uppercase tracking-widest ${
                  isActive ? "text-white font-medium" : "text-gray-400"
                }`}
              >
                {item}
              </span>

              <span
                className={`relative mt-1 h-1 w-1 rounded-full ${
                  isActive ? "bg-white" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
