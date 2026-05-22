// components/shared/LogoutModal.tsx
"use client";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut,
}: LogoutModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => !isLoggingOut && onClose()}
      />

      {/* Modal Content */}
      <div className="relative bg-white p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
        <h4 className="text-sm font-medium uppercase tracking-[0.2em] mb-3">
          Confirm Logout
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-8">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex flex-col gap-3">
          <button
            disabled={isLoggingOut}
            onClick={onConfirm}
            className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoggingOut ? "Logging out..." : "Yes, Log out"}
          </button>

          <button
            disabled={isLoggingOut}
            onClick={onClose}
            className="w-full py-3 border border-gray-200 text-[10px] uppercase tracking-widest hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
