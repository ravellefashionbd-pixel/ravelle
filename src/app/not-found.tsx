"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f7f6f4] text-black px-6">
      <div className="text-center max-w-md">
        {/* BIG NUMBER */}
        <h1 className="text-[110px] leading-none font-extralight tracking-tight">
          404
        </h1>

        {/* SUB TITLE */}
        <p className="text-[10px] tracking-[0.35em] text-black/40 uppercase mt-4">
          page not found
        </p>

        {/* LINE */}
        <div className="w-20 h-[1px] bg-black/20 mx-auto my-6" />

        {/* DESCRIPTION */}
        <p className="text-[12px] tracking-wide text-black/60 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* BUTTONS */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-2 border border-black/20 text-[10px] tracking-[0.3em]
            uppercase hover:bg-black hover:text-white transition"
          >
            Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 text-[10px] tracking-[0.3em] uppercase text-black/60
            hover:text-black transition"
          >
            Go Back
          </button>
        </div>

        {/* FOOTER STYLE LINE */}
        <div className="mt-10 text-[9px] tracking-[0.3em] text-black/30 uppercase">
          Ravelle · curated experience
        </div>
      </div>
    </div>
  );
}
