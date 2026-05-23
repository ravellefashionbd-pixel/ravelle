"use client";

import { useRef, useState } from "react";
import { LogOut, Camera } from "lucide-react";
import "@/shared/cssFiles/amindashboard/settings.css";
import toast from "react-hot-toast";
import { updateProfile } from "@/../app/actions/user-dashboard-actions/updateProfile";
import { compressImage } from "@/../lib/utils/compress";
import { logout } from "@/../app/actions/auth/logout";
import LogoutModal from "../../ui/LogoutModal";

// Note: address is now in user_addresses table (separate),
// so we only update full_name, phone, and avatar_url here.
export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [notify, setNotify] = useState(true);

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
    // avatar_url is updated via the image field
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
      <div className="page">
        {/* HEADER */}
        <div>
          <div className="title">Settings</div>
          <div className="sub">Admin Panel</div>
        </div>

        {/* PROFILE */}
        <form onSubmit={handleFormSubmit} className="section">
          <div className="label">Profile</div>

          <div className="profile">
            <div
              className="avatar"
              onClick={() => fileInputRef.current?.click()}
              style={{ position: "relative", cursor: "pointer" }}
            >
              {preview ? (
                <img src={preview} alt="avatar preview" />
              ) : (
                <div className="avatar-fallback">A</div>
              )}

              <div className="cam">
                <Camera size={11} color="#fff" />
              </div>

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

              {preview && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfileRemove();
                  }}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "18px",
                    height: "18px",
                    background: "#111",
                    color: "#fff",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  ×
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div className="field">
                <input
                  name="full_name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Address is now managed separately via user_addresses table */}
              <p className="text-[10px] text-black/40 tracking-wide mt-1 mb-3">
                Manage delivery addresses from your account page.
              </p>

              <button type="submit" className="btn">
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>

        {/* NOTIFY */}
        <div className="section">
          <div className="label">Notifications</div>

          <div className="toggle-wrap">
            <div>Email Notifications</div>

            <button
              className={`toggle-btn ${notify ? "on" : ""}`}
              onClick={() => setNotify(!notify)}
            >
              <div className="knob" />
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-12 flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase
            text-gray-600 bg-white border border-gray-200
            rounded-none
            hover:border-gray-400 hover:text-black
            active:border-gray-500 active:text-black"
        >
          <LogOut size={12} /> Logout
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
