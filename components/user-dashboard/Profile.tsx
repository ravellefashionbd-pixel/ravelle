"use client";

import { useState } from "react";
import UpdateProfile from "./UpdateProfileForm";

interface ProfileProps {
  full_name: string;
  email: string;
  phone?: string;
  image?: string;
}

export default function Profile({
  full_name,
  email,
  phone,
  image,
}: ProfileProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <>
      {mode === "view" && (
        <div className="bg-white/60 backdrop-blur-xl border border-gray-100 p-5 sm:p-6 md:p-10 shadow-sm">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 sm:mb-10">
            {/* USER INFO */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100">
                {image ? (
                  <img
                    src={image}
                    loading="lazy"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-light">
                    {full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{full_name}</p>
                <p className="text-xs text-gray-400 break-all sm:break-normal">
                  {email}
                </p>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={() => setMode("edit")}
              className="relative inline-flex items-center gap-3 px-2 py-1 group self-start sm:self-auto"
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] sm:tracking-[0.4em] text-gray-500 group-hover:text-black transition duration-300">
                UPDATE PROFILE
              </span>
              <span className="absolute top-0 right-0 w-3 h-[1px] bg-black/20 group-hover:w-6 transition-all duration-500"></span>
              <span className="absolute top-0 right-0 h-3 w-[1px] bg-black/20 group-hover:h-6 transition-all duration-500"></span>
            </button>
          </div>

          {/* SECONDARY INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-10 sm:gap-x-16 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Membership
              </p>
              <p className="text-black">Premium</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Phone
              </p>
              <p className="text-black">{phone ? phone : "Not Added"}</p>
            </div>
          </div>
        </div>
      )}

      {mode === "edit" && <UpdateProfile setMode={setMode} />}
    </>
  );
}
