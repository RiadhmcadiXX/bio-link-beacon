
import React, { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShareBioLinkDialog } from './ShareBioLinkDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileLink } from '@/components/ProfileLink';

export const BioLinkBlock = () => {
  const { user } = useAuthContext();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Fetch profile data
  const { data: profileData } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch links data ordered by position
  const { data: links } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
  // Extract username from user metadata or use email as fallback
  const username = user?.username || profileData?.username;
  
  const profileUrl = `/${username}`;

  const handleLinkClick = async (linkId: string, url: string) => {
    // Increment click count
    try {
      await supabase.rpc('increment_link_click', { link_id: linkId });
    } catch (error) {
      console.error('Failed to increment click count:', error);
    }
    
    // Open the link
    window.open(url, '_blank');
  };
  
  return (
    <div className="w-full bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-4 border-b">
      <div className="container mx-auto">
        {/* Profile Info Section */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={profileData?.avatar_url || undefined} 
              alt={profileData?.display_name || profileData?.username || 'User'} 
            />
            <AvatarFallback>
              {(profileData?.display_name || profileData?.username || 'User').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">
              {profileData?.display_name || profileData?.username || 'Your Profile'}
            </h2>
            {profileData?.bio && (
              <p className="text-sm text-gray-600 mt-1">{profileData.bio}</p>
            )}
          </div>
        </div>

        {/* Links Section - ordered by position */}
        {links && links.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Links:</h3>
            <div className="space-y-2">
              {links.map((link) => (
                <ProfileLink
                  key={link.id}
                  link={link}
                  themeColor={profileData?.theme || 'purple'}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  template={profileData?.template || 'default'}
                  buttonStyle={profileData?.button_style || 'default'}
                  fontFamily={profileData?.font_family || 'default'}
                />
              ))}
            </div>
          </div>
        )}

        {/* URL and Actions Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium mr-1 text-sm">Your profile:</span>
            <Link to={profileUrl} className="text-brand-purple hover:underline truncate max-w-[200px] sm:max-w-xs text-sm">
              {window.location.origin}/{username}
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-xs"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-3 w-3" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            <a 
              href={`${window.location.origin}/${username}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm bg-brand-purple text-white px-3 py-1 rounded-md hover:bg-brand-purple/90 transition-colors"
            >
              <span className="mr-1 hidden sm:inline">Visit</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
      
      <ShareBioLinkDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};
