import { useEffect, useState } from "react";

const RotatingAvatar = () => {
  const images = [
    "https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/avatars/profile_avatars/avatar1.png",
    "https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/avatars/profile_avatars/avatar2.png",
    "https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/avatars/profile_avatars/avatar3.png",
    "https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/avatars/profile_avatars/avatar4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1000); // ⏱️ Change every 1s

    return () => clearInterval(interval); // Clean up on unmount
  }, [images.length]);

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-2">
      <img
        src={images[currentIndex]}
        alt={`Profile ${currentIndex}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
    </div>
  );
};

export default RotatingAvatar;
