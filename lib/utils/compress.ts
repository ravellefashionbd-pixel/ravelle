import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 3,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Compression Error:", error);
    return file;
  }
};
