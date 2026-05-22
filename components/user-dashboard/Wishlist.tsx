export default function Wishlist() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 md:p-10 shadow-sm text-center">
      {/* TITLE */}
      <h3 className="uppercase text-xs tracking-[0.3em] text-gray-500 mb-6">
        Wishlist
      </h3>

      {/* ICON (OPTIONAL LUXURY TOUCH) */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          ♥
        </div>
      </div>

      {/* MESSAGE */}
      <p className="text-sm text-gray-500 mb-6">
        Your wishlist is currently empty
      </p>

      {/* CTA BUTTON */}
      <button className="px-6 py-2 border text-xs tracking-widest uppercase hover:bg-black hover:text-white transition">
        Discover Products
      </button>
    </div>
  );
}
