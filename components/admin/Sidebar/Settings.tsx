"use client";

import { useRef, useState } from "react";
import { LogOut, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "@/../app/actions/user-dashboard-actions/updateProfile";
import { compressImage } from "@/../lib/utils/compress";
import { logout } from "@/../app/actions/auth/logout";
import LogoutModal from "../../ui/LogoutModal";

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("phone", form.phone);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(result.message);
        setForm({ full_name: "", phone: "" });
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  const handleProfileRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-xl font-light tracking-widest uppercase text-black">
            Settings
          </h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">
            Admin Panel
          </p>
        </div>

        {/* PROFILE SECTION */}
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 border border-gray-100 p-6"
        >
          <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-5">
            Profile
          </div>

          <div className="flex gap-6 items-start">
            {/* AVATAR */}
            <div
              className="relative w-16 h-16 shrink-0 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="avatar preview"
                  className="w-16 h-16 object-cover rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-lg font-light text-gray-500">
                  A
                </div>
              )}

              {/* Camera icon */}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <Camera size={10} color="#fff" />
              </div>

              {/* Remove button */}
              {preview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileRemove();
                  }}
                  className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center hover:bg-gray-700"
                >
                  ×
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    const optimizedFile = await compressImage(file);
                    setSelectedFile(optimizedFile);
                    setPreview(URL.createObjectURL(optimizedFile));
                  } else {
                    setSelectedFile(null);
                    setPreview(null);
                  }
                }}
              />
            </div>

            {/* FIELDS */}
            <div className="flex-1 space-y-3">
              <input
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition placeholder:text-gray-300"
              />
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-2.5 text-sm outline-none focus:border-black transition placeholder:text-gray-300"
              />

              <p className="text-[10px] text-black/40 tracking-wide pt-1">
                Manage delivery addresses from your account page.
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-black text-white text-[10px] tracking-[0.3em] uppercase
                  hover:bg-gray-800 active:scale-[0.98] transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>

        {/* NOTIFICATIONS SECTION */}
        <div className="mb-6 border border-gray-100 p-6">
          <div className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-5">
            Notifications
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Notifications</span>

            <button
              type="button"
              onClick={() => setNotify(!notify)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                notify ? "bg-black" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  notify ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase
            text-gray-600 bg-white border border-gray-200
            hover:border-gray-400 hover:text-black
            active:border-gray-500 transition"
        >
          <LogOut size={12} />
          Logout
        </button>

        <LogoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </>
  );
}
