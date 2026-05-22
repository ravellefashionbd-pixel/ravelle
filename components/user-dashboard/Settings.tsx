import { useState } from "react";
import { logout } from "../../app/actions/auth/logout";
import LogoutModal from "../ui/LogoutModal";

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-5 md:p-8 shadow-sm">
      {/* TITLE */}
      <h3 className="uppercase text-xs tracking-[0.3em] text-gray-500 mb-6">
        Settings
      </h3>

      {/* INFO TEXT */}
      <p className="text-sm text-gray-500 mb-6">
        Manage your account preferences and security options.
      </p>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* CHANGE PASSWORD */}
        <button className="px-6 py-2 border text-xs tracking-widest uppercase hover:bg-black hover:text-white transition">
          Change Password
        </button>

        {/* LOGOUT*/}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 border text-xs tracking-widest uppercase text-red-500 border-red-200 hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>

        {/* LogoutModal */}
        <LogoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </div>
  );
}
