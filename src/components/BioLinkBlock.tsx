import React, { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShareBioLinkDialog } from './ShareBioLinkDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileLink } from '@/components/ProfileLink';
import { useUserTemplate } from '@/hooks/useUserTemplate';

export const BioLinkBlock = () => {
  const { user } = useAuthContext();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Extract username from user metadata or use email as fallback
  const username = user?.username;
  
  const profileUrl = `/${username}`;

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch user links ordered by position
  const { data: links = [] } = useQuery({
    queryKey: ['links', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Get user template data
  const { userTemplate } = useUserTemplate(user?.id);

  // Click tracking mutation
  const incrementClick = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.rpc('increment_link_click', { 
        link_id: linkId 
      });
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', user?.id] });
    }
  });

  const handleLinkClick = (linkId: string) => {
    incrementClick.mutate(linkId);
  };

  // Get effective template settings
  const effectiveTemplate = profile?.template || 'default';
  const effectiveThemeColor = userTemplate?.custom_color || userTemplate?.theme_color || profile?.theme || 'purple';
  const effectiveButtonStyle = userTemplate?.button_style || profile?.button_style || 'default';
  const effectiveFontFamily = userTemplate?.font_family || profile?.font_family || 'default';
  const effectiveGradientFrom = userTemplate?.gradient_from;
  const effectiveGradientTo = userTemplate?.gradient_to;
  
  return (
    <div className="w-full bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border-b">
      <div className="container mx-auto p-4">
        {/* Header with profile info and actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="font-medium mr-1">Your profile:</span>
            <Link to={profileUrl} className="text-brand-purple hover:underline truncate max-w-[200px] sm:max-w-xs">
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

        {/* Profile preview section */}
        {profile && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* Profile header */}
            <div className="text-center mb-4">
              <Avatar className="h-16 w-16 mx-auto mb-2">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
                <AvatarFallback>{(profile.display_name || profile.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-bold">{profile.display_name || profile.username}</h2>
              {profile.bio && <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>}
            </div>

            {/* Links with exact dashboard styling */}
            <div className="space-y-3">
              {links.map((link) => (
                <ProfileLink
                  key={link.id}
                  link={link}
                  themeColor={effectiveThemeColor}
                  onClick={() => handleLinkClick(link.id)}
                  template={effectiveTemplate}
                  buttonStyle={effectiveButtonStyle}
                  fontFamily={effectiveFontFamily}
                  gradientFrom={effectiveGradientFrom}
                  gradientTo={effectiveGradientTo}
                />
              ))}
              {links.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No links added yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <ShareBioLinkDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};
