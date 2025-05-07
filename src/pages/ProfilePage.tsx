
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { WaveAnimation } from "@/components/animations/WaveAnimation";
import { ParticlesAnimation } from "@/components/animations/ParticlesAnimation";
import { LightBlueToBlue_template } from "@/components/animations/LightBlueToBlue_template";

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image: string | null;
  avatar_url: string | null;
  theme: string | null;
  template: string | null;
  button_style: string | null;
  font_family: string | null;
  animation_type?: string | null;
  sections_layout?: Record<string, string> | null;
  // Add the missing properties
  gradientFrom?: string | null;
  gradientTo?: string | null;
  customColor?: string | null;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  linkType?: string;
  clicks: number;
  section?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();

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
          themeColor,
          buttonStyle: profile.button_style || 'minimal',
          fontFamily: profile.font_family || 'default'
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
          themeColor: 'blue',
          buttonStyle: profile.button_style || 'outline',
          fontFamily: profile.font_family || 'serif'
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
          themeColor: 'pink',
          buttonStyle: profile.button_style || 'gradient',
          fontFamily: profile.font_family || 'display'
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
          themeColor: 'blue',
          buttonStyle: profile.button_style || 'rounded',
          fontFamily: profile.font_family || 'handwritten'
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
          themeColor: 'orange',
          buttonStyle: profile.button_style || 'shadow',
          fontFamily: profile.font_family || 'mono'
        };
      case 'custom':
        return {
          background: `bg-gradient-to-br ${theme === 'purple' ? 'from-purple-100 to-purple-200' :
            theme === 'blue' ? 'from-blue-100 to-blue-200' :
              theme === 'pink' ? 'from-pink-100 to-pink-200' :
                'from-orange-100 to-orange-200'
            }`,
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20',
          header: 'text-center mb-6',
          title: 'text-xl font-bold',
          bio: 'text-gray-600 text-sm',
          links: 'space-y-3',
          themeColor,
          buttonStyle: profile.button_style || 'default',
          fontFamily: profile.font_family || 'default'
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
          themeColor,
          buttonStyle: profile.button_style || 'default',
          fontFamily: profile.font_family || 'default'
        };
    }
  };

  const templateStyles = getTemplateStyles();

  // Group links by section
  const groupLinksBySection = () => {
    if (!links) return {};

    const sections: Record<string, Link[]> = {};

    links.forEach(link => {
      const section = link.section || 'default';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(link);
    });

    return sections;
  };

  const sectionedLinks = groupLinksBySection();

  // Get section layout
  const getSectionLayout = (sectionName: string): string => {
    if (!profile.sections_layout) return 'list';
    return profile.sections_layout[sectionName] || 'list';
  };

  // Get section title display
  const getSectionTitle = (sectionName: string): string => {
    if (sectionName === 'default') return '';
    return sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  };

  // Determine if the current template has animations
  const hasAnimation = (): boolean => {
    const template = profile.template || 'default';
    return (
      template === 'floating-particles' ||
      template === 'wave-background' ||
      template === 'gradient-flow' ||
      (template === 'custom' && !!profile.animation_type)
    );
  };

  // Get animation type based on template or custom settings
  const getAnimationType = (): string | null => {
    const template = profile.template || 'default';
    
    if (template === 'custom') {
      return profile.animation_type || null;
    }

    switch (template) {
      case 'floating-particles': return 'particles';
      case 'wave-background': return 'waves';
      case 'gradient-flow': return 'gradientFlow';
      default: return null;
    }
  };

  // Render the appropriate animation component
  const renderAnimation = () => {
    if (!hasAnimation()) return null;
    
    const animationType = getAnimationType();
    
    switch (animationType) {
      case 'waves':
        return <WaveAnimation />;
      case 'particles':
        return <ParticlesAnimation />;
      case 'gradientFlow':
        return <LightBlueToBlue_template fromColor="#00B4DB" toColor="#0083B0" speed={0.3} />

      default:
        return null;
    }
  };

  // Get custom background style if needed
  const getCustomBackgroundStyle = () => {
    if (profile.template === 'custom') {
      if (profile.gradientFrom && profile.gradientTo) {
        return {
          background: `linear-gradient(135deg, ${profile.gradientFrom} 0%, ${profile.gradientTo} 100%)`
        };
      } else if (profile.customColor) {
        return {
          backgroundColor: profile.customColor
        };
      }
    }
    return {};
  };

  console.log('Profile template:', profile.template, 'Animation type:', getAnimationType(), 'Has animation:', hasAnimation());

  return (
    <div 
      className={`min-h-screen ${templateStyles.background} py-12 px-4`}
      style={getCustomBackgroundStyle()}
    >
      {/* Animation background based on template */}
      {renderAnimation()}
      
      <div className={`${templateStyles.container} relative z-10`}>
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

        {/* Social Icons (if any) */}
        {sectionedLinks['social'] && (
          <div className="flex justify-center flex-wrap my-6">
            {sectionedLinks['social'].map((link) => (
              <ProfileLink
                key={link.id}
                link={link}
                themeColor={templateStyles.themeColor}
                template={profile.template || 'default'}
                buttonStyle={templateStyles.buttonStyle}
                fontFamily={templateStyles.fontFamily}
                onClick={() => handleLinkClick(link.id)}
                layout="icons"
              />
            ))}
          </div>
        )}

        {/* Sections */}
        {Object.entries(sectionedLinks).map(([sectionName, sectionLinks]) => {
          if (sectionName === 'social') return null; // Already handled above

          const layout = getSectionLayout(sectionName);
          const sectionTitle = getSectionTitle(sectionName);
          const isProducts = sectionName === 'products';

          return (
            <div key={sectionName} className="mb-8">
              {/* Section Title */}
              {sectionTitle && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold">{sectionTitle}</h2>
                  {isProducts && (
                    <p className="text-sm text-gray-500">Explore our products</p>
                  )}
                </div>
              )}

              {/* Section Links */}
              {layout === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionLinks.map((link, index) => (
                    <ProfileLink
                      key={link.id}
                      link={link}
                      themeColor={templateStyles.themeColor}
                      template={profile.template || 'default'}
                      buttonStyle={templateStyles.buttonStyle}
                      fontFamily={templateStyles.fontFamily}
                      onClick={() => handleLinkClick(link.id)}
                      layout="grid"
                      isProduct={isProducts}
                      cardIndex={index}
                    />
                  ))}
                </div>
              ) : (
                <div className={templateStyles.links}>
                  {sectionLinks.map((link) => (
                    <ProfileLink
                      key={link.id}
                      link={link}
                      themeColor={templateStyles.themeColor}
                      template={profile.template || 'default'}
                      buttonStyle={templateStyles.buttonStyle}
                      fontFamily={templateStyles.fontFamily}
                      onClick={() => handleLinkClick(link.id)}
                      isProduct={isProducts}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Show loading or no links message if needed */}
        {linksLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          ))
        ) : links && links.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No links yet</p>
          </div>
        ) : null}

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
