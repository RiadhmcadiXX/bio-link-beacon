
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/AvatarUpload";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  template: string | null;
  theme: string | null;
  button_style?: string | null;
  font_family?: string | null;
  customColor?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  animation_type?: string | null;
}

interface ProfileSettingsProps {
  profileData: Profile | undefined;
  isLoading: boolean;
  userId: string | undefined;
}

export const ProfileSettings = ({ profileData, isLoading, userId }: ProfileSettingsProps) => {
  const queryClient = useQueryClient();

  // Profile update mutation
  const updateAvatar = useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!userId) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (error) throw error;
      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success("Profile picture updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  });

  const handleAvatarUpdate = (url: string) => {
    updateAvatar.mutate(url);
  };

  if (isLoading) {
    return <div className="text-center py-6">Loading profile settings...</div>;
  }

  if (!profileData) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Error loading profile</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['profile', userId] })} className="mt-2">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Profile Image</h2>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
        <AvatarUpload
          userId={userId || ''}
          existingUrl={profileData.avatar_url}
          onAvatarUpdate={handleAvatarUpdate}
          size="lg"
        />
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-medium">Profile Settings</h3>
            <p className="text-sm text-gray-500">
              For more profile settings, please visit the settings page.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/settings">Manage Your Profile</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
