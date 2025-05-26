
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { renderAnimationBackground } from "@/utils/templateAnimations";
import { getTemplateStyles, getBackgroundStyle, getTextColor } from "@/utils/templateStyles";
import { useUserTemplate } from "@/hooks/useUserTemplate";

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

  // Get user template data
  const { userTemplate } = useUserTemplate(profile?.id);

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

  // Create template configuration from user template or profile data
  const templateConfig = {
    name: userTemplate?.template_name || profile.template || 'default',
    buttonStyle: userTemplate?.button_style || profile.button_style || 'default',
    fontFamily: userTemplate?.font_family || profile.font_family || 'default',
    themeColor: userTemplate?.theme_color || profile.theme || 'purple',
    customColor: userTemplate?.custom_color || profile.customColor,
    gradientFrom: userTemplate?.gradient_from || profile.gradientFrom,
    gradientTo: userTemplate?.gradient_to || profile.gradientTo,
    backgroundType: userTemplate?.background_type || 'color',
    backgroundColor: userTemplate?.background_color,
    backgroundImageUrl: userTemplate?.background_image_url,
    backgroundOverlay: userTemplate?.background_overlay,
    hasAnimation: userTemplate?.has_animation || false,
    animationType: userTemplate?.animation_type || profile.animation_type
  };

  const template = templateConfig.name;

  // Get unified template styles
  const templateStyles = getTemplateStyles(template, templateConfig);

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

  // Font class mapping
  const fontClassMap: Record<string, string> = {
    inter: "font-inter",
    roboto: "font-roboto",
    poppins: "font-poppins",
    montserrat: "font-montserrat",
    raleway: "font-raleway",
    playfair: "font-playfair",
    lobster: "font-lobster",
    pacifico: "font-pacifico",
    oswald: "font-oswald",
    lato: "font-lato",
    merriweather: "font-merriweather",
    dancing: "font-dancing",
    quicksand: "font-quicksand",
    comfortaa: "font-comfortaa",
    nunito: "font-nunito",
    serif: "font-serif",
    mono: "font-mono",
    display: "font-extrabold tracking-wide",
    handwritten: "italic",
    default: "font-sans",
  };
  
  const fontClass = fontClassMap[templateConfig.fontFamily] || "font-sans";
  const textColorClass = getTextColor(template, templateConfig);

  console.log('Profile template:', template, 'Animation type:', templateConfig.animationType, 'Has animation:', templateConfig.hasAnimation);

  return (
    <div
      className={`min-h-screen ${templateStyles.background} py-12 px-4`}
      style={getBackgroundStyle(template, templateConfig)}
    >
      {/* Render animated background if needed */}
      {templateConfig.backgroundType === 'animated' && renderAnimationBackground(template, { animation_type: templateConfig.animationType })}

      <div className={`${templateStyles.container} ${fontClass} ${textColorClass}`}>
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
                template={template}
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
                      template={template}
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
                      template={template}
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
