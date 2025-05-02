
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  userId: string;
  existingUrl: string | null;
  onAvatarUpdate: (url: string) => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  userId, 
  existingUrl, 
  onAvatarUpdate,
  size = "lg" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Size classes mapping
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40"
  };

  const avatarSize = sizeClasses[size];
  
  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error("Only JPG and PNG files are allowed");
      return;
    }
    
    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${userId}/${userId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // Update parent component
      onAvatarUpdate(data.publicUrl);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };
  
  // Clear selected file
  const handleClear = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setPreviewUrl(existingUrl);
    setSelectedFile(null);
  };
  
  // Get initials for fallback
  const getInitials = () => {
    return "U";  // Default fallback
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={`${avatarSize} relative group`}>
        <AvatarImage src={previewUrl || undefined} alt="Profile Avatar" className="object-cover" />
        <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Image
          </Button>
          
          {selectedFile && (
            <Button 
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {selectedFile && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-brand-purple hover:bg-brand-purple/90"
          >
            {uploading ? "Uploading..." : "Upload Picture"}
          </Button>
        )}
        
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        
        <p className="text-xs text-gray-500">
          JPG or PNG. Max 1MB.
        </p>
      </div>
    </div>
  );
};
