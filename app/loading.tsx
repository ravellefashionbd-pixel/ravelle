export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Brand mark */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border border-black/10 animate-pulse" />
          <div className="absolute inset-2 border border-black/30 animate-spin-slow" />
        </div>

        {/* Text */}
        <div className="text-[10px] tracking-[0.35em] text-black/40 uppercase">
          Ravelle
        </div>

        {/* subtle line animation */}
        <div className="w-24 h-[1px] bg-black/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/40 animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
