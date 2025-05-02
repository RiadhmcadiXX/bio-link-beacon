
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
  template: string | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
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

  // Template styles
  const getTemplateStyles = () => {
    const template = profile.template || 'default';
    const theme = profile.theme || 'purple'; // Provide a default if null
    
    // Base theme color based on user preference
    let themeColor;
    switch (theme) {
      case 'blue': themeColor = 'blue'; break;
      case 'pink': themeColor = 'pink'; break;
      case 'orange': themeColor = 'orange'; break;
      default: themeColor = 'purple'; break;
    }
    
    // Template-specific styles
    switch (template) {
      case 'minimal':
        return { 
          background: 'bg-white',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-16 w-16',
          header: 'text-center mb-6',
          title: 'text-xl font-semibold',
          bio: 'text-sm text-gray-500',
          links: 'space-y-2',
          themeColor
        };
      case 'elegant-dark':
        return { 
          background: 'bg-gray-900',
          container: 'max-w-md mx-auto px-6 py-10',
          avatar: 'h-20 w-20 ring-2 ring-gray-800',
          header: 'text-center mb-8 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-gray-400',
          links: 'space-y-3',
          themeColor: 'blue'
        };
      case 'gradient':
        return { 
          background: 'bg-gradient-to-br from-purple-500 to-pink-500',
          container: 'max-w-md mx-auto px-5 py-8',
          avatar: 'h-24 w-24 ring-4 ring-white/20',
          header: 'text-center mb-6 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-white/80',
          links: 'space-y-3',
          themeColor: 'pink'
        };
      case 'bubbles':
        return { 
          background: 'bg-blue-50',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20 border-4 border-blue-200',
          header: 'text-center mb-8',
          title: 'text-2xl font-bold text-blue-800',
          bio: 'text-sm text-blue-600',
          links: 'space-y-4',
          themeColor: 'blue'
        };
      case 'modern':
        return { 
          background: 'bg-gray-100',
          container: 'max-w-md mx-auto px-4 py-10',
          avatar: 'h-24 w-24',
          header: 'text-left mb-8 flex items-center gap-4',
          title: 'text-xl font-bold',
          bio: 'text-sm text-gray-600 mt-1',
          links: 'space-y-3',
          themeColor: 'orange'
        };
      default: // default template
        return { 
          background: profile.theme ? `bg-gradient-to-br from-${theme}-50 to-${theme}-100` : 'bg-gradient-to-br from-purple-50 to-purple-100',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20',
          header: 'text-center mb-6',
          title: 'text-xl font-bold',
          bio: 'text-gray-600 text-sm',
          links: 'space-y-3',
          themeColor
        };
    }
  };

  const templateStyles = getTemplateStyles();

  return (
    <div className={`min-h-screen ${templateStyles.background} py-12 px-4`}>
      <div className={templateStyles.container}>
        {/* Profile Header */}
        {templateStyles.header.includes('flex') ? (
          <div className={templateStyles.header}>
            <Avatar className={templateStyles.avatar}>
              <AvatarImage 
                src={profile.avatar_url || profile.profile_image || undefined} 
                alt={profile.display_name || profile.username} 
              />
              <AvatarFallback>
                {(profile.display_name || profile.username).substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className={templateStyles.title}>{profile.display_name || profile.username}</h1>
              {profile.bio && <p className={templateStyles.bio}>{profile.bio}</p>}
            </div>
          </div>
        ) : (
          <div className={templateStyles.header}>
            <Avatar className={`mx-auto mb-4 ${templateStyles.avatar}`}>
              <AvatarImage 
                src={profile.avatar_url || profile.profile_image || undefined} 
                alt={profile.display_name || profile.username} 
              />
              <AvatarFallback>
                {(profile.display_name || profile.username).substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className={templateStyles.title}>{profile.display_name || profile.username}</h1>
            {profile.bio && <p className={`mt-2 ${templateStyles.bio}`}>{profile.bio}</p>}
          </div>
        )}

        {/* Links */}
        <div className={templateStyles.links}>
          {linksLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))
          ) : links && links.length > 0 ? (
            links.map((link) => (
              <ProfileLink 
                key={link.id} 
                link={link} 
                themeColor={templateStyles.themeColor}
                template={profile.template || 'default'}
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
