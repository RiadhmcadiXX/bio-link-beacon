
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { ProfileLink } from "@/components/ProfileLink";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image: string | null;
  avatar_url: string | null;
  theme: string | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Fetch profile data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  // Fetch links data
  const {
    data: links,
    isLoading: linksLoading,
    error: linksError,
  } = useQuery({
    queryKey: ["links", profile?.id],
    queryFn: async () => {
      if (!profile) return [];

      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Link[];
    },
    enabled: !!profile,
  });

  // Update link clicks
  const updateLinkClicks = useMutation({
    mutationFn: async (linkId: string) => {
      // Directly fetch and update the clicks count
      const { data: linkData, error: fetchError } = await supabase
        .from('links')
        .select('clicks')
        .eq('id', linkId)
        .single();
  
      if (fetchError) throw fetchError;
  
      if (linkData) {
        const { error: updateError } = await supabase
          .from('links')
          .update({ clicks: (linkData.clicks || 0) + 1 })
          .eq('id', linkId);
  
        if (updateError) throw updateError;
      }
    },
  });

  // Function to handle link clicks
  const handleLinkClick = (linkId: string) => {
    updateLinkClicks.mutate(linkId);
  };

  const isLoading = profileLoading || (!profile && !profileError);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="space-y-3 w-full max-w-md">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-gray-600 mb-6">The profile you're looking for doesn't seem to exist.</p>
        <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    );
  }

  // Theme styles based on user's preference
  const getThemeStyles = () => {
    const theme = profile.theme || 'purple'; // Provide a default if null
    switch (theme) {
      case 'blue':
        return { background: 'bg-gradient-to-br from-blue-50 to-blue-100', button: 'bg-brand-blue hover:bg-brand-blue/90' };
      case 'pink':
        return { background: 'bg-gradient-to-br from-pink-50 to-pink-100', button: 'bg-brand-pink hover:bg-brand-pink/90' };
      case 'orange':
        return { background: 'bg-gradient-to-br from-orange-50 to-orange-100', button: 'bg-brand-orange hover:bg-brand-orange/90' };
      default: // purple
        return { background: 'bg-gradient-to-br from-purple-50 to-purple-100', button: 'bg-brand-purple hover:bg-brand-purple/90' };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen ${themeStyles.background} py-12 px-4`}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage 
              src={profile.avatar_url || profile.profile_image || undefined} 
              alt={profile.display_name || profile.username} 
            />
            <AvatarFallback>
              {(profile.display_name || profile.username).substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>
          {profile.bio && <p className="text-gray-600 text-center mt-2">{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {linksLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))
          ) : links && links.length > 0 ? (
            links.map((link) => (
              <ProfileLink 
                key={link.id} 
                link={link} 
                themeColor={profile.theme || 'purple'} 
                onClick={() => handleLinkClick(link.id)} 
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No links yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by <a href="/" className="font-medium hover:underline">LinkBeacon</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
