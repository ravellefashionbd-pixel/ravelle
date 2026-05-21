"use client";
import { useState } from "react";

const items = [
  {
    label: "WhatsApp",
    href: "https://wa.me/880XXXXXXXXXX",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.419A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Messenger",
    href: "https://m.me/yourpage",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 3.027 1.52 5.724 3.9 7.49V22l3.556-1.955c.949.263 1.952.404 2.988.404 5.523 0 10-4.856 10-10.206C22 6.145 17.523 2 12 2z" />
        <path
          d="M6.5 14l3.5-3.75L12.5 12l3.5-3.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2.5">
      {/* Options */}
      <div
        className="flex flex-col items-end gap-2.5"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(10px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {items.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3"
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-neutral-400
                 opacity-0 group-hover:opacity-100 group-hover:text-neutral-900
                 transition-all duration-200 whitespace-nowrap"
            >
              {label}
            </span>

            <div
              className="w-[46px] h-[46px] bg-white flex items-center justify-center
                 text-neutral-600 hover:bg-neutral-900 hover:text-white
                 transition-all duration-200"
              style={{ border: "0.5px solid #c8c4bc" }}
            >
              {icon}
            </div>
          </a>
        ))}
      </div>

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-[46px] h-[46px] bg-neutral-900 hover:bg-neutral-700
                   flex items-center justify-center text-white transition-colors duration-200"
        style={{ border: "0.5px solid #111" }}
      >
        {open ? (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
