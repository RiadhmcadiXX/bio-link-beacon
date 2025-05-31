
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
  
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload images");
        return null;
      }
  
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
  
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);
  
      if (error) {
        console.error('Upload error:', error);
        toast.error("Failed to upload image");
        return null;
      }
  
      // ✅ Get the public URL properly
      const { data: publicData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
  
      const publicUrl = publicData.publicUrl;
  
      if (!publicUrl) {
        toast.error("Could not retrieve public URL");
        return null;
      }
  
      toast.success("Image uploaded successfully!");
      return publicUrl;
  
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Unexpected error during upload");
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  

  return { uploadImage, isUploading };
};

export { useImageUpload };
