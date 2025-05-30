import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { renderAnimationBackground } from "@/utils/templateAnimations";
import { templatesLibrary } from "@/constants/templates";
import { useUserTemplate } from "@/hooks/useUserTemplate";
import { getTemplateStyles, getBackgroundStyle, getTextColor } from "@/utils/templateStyles";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LivePreviewProps {
  profile: {
    id?: string;
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    theme?: string | null;
    button_style?: string | null;
    font_family?: string | null;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    linkType?: string;
    clicks?: number;
    position?: number;
  }>;
  template: string;
  themeColor: string;
  buttonStyle: string;
  fontFamily: string;
  customColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const LivePreview = ({
  profile,
  links,
  template,
  themeColor,
  buttonStyle,
  fontFamily,
  customColor,
  gradientFrom,
  gradientTo
}: LivePreviewProps) => {
  // Get user template data if profile has an id
  const { userTemplate } = useUserTemplate(profile.id);
  
  // Get template configuration from library
  const templateConfig = templatesLibrary.find(t => t.id === template);

  // Use user template data if available, otherwise use props or template config
  const effectiveTemplate = {
    name: template,
    buttonStyle: userTemplate?.button_style || buttonStyle || templateConfig?.buttonStyle || 'default',
    fontFamily: userTemplate?.font_family || fontFamily || templateConfig?.fontFamily || 'default',
    themeColor: userTemplate?.theme_color || themeColor || 'purple',
    customColor: userTemplate?.custom_color || customColor,
    gradientFrom: userTemplate?.gradient_from || gradientFrom,
    gradientTo: userTemplate?.gradient_to || gradientTo,
    backgroundType: userTemplate?.background_type || templateConfig?.backgroundType || 'color',
    backgroundColor: userTemplate?.background_color || templateConfig?.backgroundConfig?.color,
    backgroundImageUrl: userTemplate?.background_image_url || templateConfig?.backgroundConfig?.image,
    backgroundOverlay: userTemplate?.background_overlay || templateConfig?.backgroundConfig?.overlay,
    hasAnimation: userTemplate?.has_animation || templateConfig?.hasAnimation || false,
    animationType: userTemplate?.animation_type || templateConfig?.animationType
  };

  // Get unified template styles
  const styles = getTemplateStyles(template, effectiveTemplate);
  
  // Sort links by position before displaying
  const sortedLinks = links && links.length > 0 
    ? [...links].sort((a, b) => (a.position || 0) - (b.position || 0))
    : [
        { id: '1', title: 'Sample Link 1', url: 'https://example.com', icon: 'globe', position: 0 },
        { id: '2', title: 'Sample Link 2', url: 'https://example.com', icon: 'link', position: 1 }
      ];

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
  
  const fontClass = fontClassMap[effectiveTemplate.fontFamily] || "font-sans";

  // Determine the effective theme color
  const effectiveThemeColor = effectiveTemplate.customColor || effectiveTemplate.themeColor;

  // Get text color based on template
  const textColorClass = getTextColor(template, effectiveTemplate);

  return (
    <div 
      className={`rounded-md overflow-hidden h-[600px] relative ${styles.background}`}
      style={getBackgroundStyle(template, effectiveTemplate)}
    >
      {/* Render animated background if needed */}
      {effectiveTemplate.backgroundType === 'animated' && renderAnimationBackground(template, { animation_type: effectiveTemplate.animationType })}
      
      <ScrollArea className="h-[600px]">
        <div className={`${styles.container} ${fontClass} ${textColorClass} px-4 py-6`}>
          {template === 'modern' ? (
            <div className={styles.header}>
              <Avatar className={styles.avatar}>
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
                <AvatarFallback>{(profile.display_name || profile.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className={styles.title}>{profile.display_name || profile.username || 'Username'}</h1>
                {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
              </div>
            </div>
          ) : (
            <div className={styles.header}>
              <Avatar className={`mx-auto mb-2 ${styles.avatar}`}>
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
                <AvatarFallback>{(profile.display_name || profile.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className={styles.title}>{profile.display_name || profile.username || 'Username'}</h1>
              {profile.bio && <p className={`mt-1 ${styles.bio}`}>{profile.bio}</p>}
            </div>
          )}

          <div className={styles.links}>
            {sortedLinks.map((link) => (
              <ProfileLink 
                key={link.id} 
                link={link} 
                themeColor={effectiveThemeColor}
                onClick={() => {}} 
                template={template}
                buttonStyle={effectiveTemplate.buttonStyle}
                fontFamily={effectiveTemplate.fontFamily}
                gradientFrom={effectiveTemplate.gradientFrom}
                gradientTo={effectiveTemplate.gradientTo}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
