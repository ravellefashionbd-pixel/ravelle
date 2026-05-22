"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "../../app/actions/user-dashboard-actions/updateProfile";
import { compressImage } from "../../lib/utils/compress";

export default function UpdateProfile({
  setMode,
}: {
  setMode: (v: "view" | "edit") => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimizedFile = await compressImage(file);
        setSelectedFile(optimizedFile);
        setPreviewUrl(URL.createObjectURL(optimizedFile));
      } catch (error) {
        console.error("Compression failed", error);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("phone", form.phone);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(result.message);
        setMode("view");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-gray-100 p-8 md:p-10 shadow-sm">
      <h3 className="uppercase text-[11px] tracking-[0.35em] text-gray-400 mb-10">
        Update Profile
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* IMAGE */}
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-widest text-gray-400">
            Profile Image
          </label>

          {previewUrl ? (
            <div className="relative w-32 h-32 group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <X size={14} />
              </button>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                <span className="text-white text-[10px] uppercase">Change</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition"
            >
              <span className="text-[10px] uppercase tracking-tighter">
                Select Image
              </span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* FULL NAME */}
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-black transition"
          required
        />

        {/* PHONE */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full bg-transparent border-b border-gray-200 pb-3 text-sm focus:outline-none focus:border-black transition"
        />

        {/* ACTIONS */}
        <div className="flex gap-6 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="text-xs uppercase tracking-[0.3em] text-black hover:opacity-60 transition"
          >
            {isPending ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setMode("view")}
            className="text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-black transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
