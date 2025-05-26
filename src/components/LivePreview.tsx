
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { renderAnimationBackground } from "@/utils/templateAnimations";
import { templatesLibrary } from "@/constants/templates";
import { useUserTemplate } from "@/hooks/useUserTemplate";

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

  // Generate styles based on template
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          background: 'bg-white',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12',
          header: 'text-center mb-4',
          title: 'text-lg font-semibold',
          bio: 'text-xs text-gray-500',
          links: 'space-y-2'
        };
      case 'elegant-dark':
        return {
          background: 'bg-gray-900',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12 ring-2 ring-gray-800',
          header: 'text-center mb-4 text-white',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-400',
          links: 'space-y-2'
        };
      case 'gradient':
        return {
          background: 'bg-gradient-to-br from-purple-500 to-pink-500',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12 ring-2 ring-white/20',
          header: 'text-center mb-4 text-white',
          title: 'text-lg font-bold',
          bio: 'text-xs text-white/80',
          links: 'space-y-2'
        };
      case 'bubbles':
        return {
          background: 'bg-blue-50',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12 border-2 border-blue-200',
          header: 'text-center mb-4',
          title: 'text-lg font-bold text-blue-800',
          bio: 'text-xs text-blue-600',
          links: 'space-y-2'
        };
      case 'modern':
        return {
          background: 'bg-gray-100',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12',
          header: 'text-left mb-4 flex items-center gap-2',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-600',
          links: 'space-y-2'
        };
      case 'custom':
        // For custom template, use template data
        if (effectiveTemplate.gradientFrom && effectiveTemplate.gradientTo) {
          return {
            background: '', // We'll use inline style for gradient
            container: 'max-w-full mx-auto px-4 py-6',
            avatar: 'h-12 w-12',
            header: 'text-center mb-4',
            title: 'text-lg font-bold',
            bio: 'text-xs text-gray-600',
            links: 'space-y-2'
          };
        }
        
        return {
          background: effectiveTemplate.customColor ? '' : `bg-gradient-to-br ${
            effectiveTemplate.themeColor === 'purple' ? 'from-purple-100 to-purple-200' :
            effectiveTemplate.themeColor === 'blue' ? 'from-blue-100 to-blue-200' :
            effectiveTemplate.themeColor === 'pink' ? 'from-pink-100 to-pink-200' :
            'from-orange-100 to-orange-200'
          }`,
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12',
          header: 'text-center mb-4',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-600',
          links: 'space-y-2'
        };
      default: // default and preset templates
        return {
          background: '', // Will use template background config
          container: 'max-w-full mx-auto px-4 py-6 relative z-10',
          avatar: 'h-12 w-12',
          header: 'text-center mb-4',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-600',
          links: 'space-y-2'
        };
    }
  };

  const styles = getTemplateStyles();
  
  // Generate background style based on template configuration
  const getBackgroundStyle = () => {
    if (template === 'custom') {
      if (effectiveTemplate.gradientFrom && effectiveTemplate.gradientTo) {
        return {
          background: `linear-gradient(135deg, ${effectiveTemplate.gradientFrom} 0%, ${effectiveTemplate.gradientTo} 100%)`
        };
      } else if (effectiveTemplate.customColor) {
        return {
          backgroundColor: effectiveTemplate.customColor
        };
      }
      return {};
    }

    switch (effectiveTemplate.backgroundType) {
      case 'color':
        return {
          backgroundColor: effectiveTemplate.backgroundColor || '#ffffff'
        };
      case 'gradient':
        if (templateConfig?.backgroundConfig?.gradient) {
          return {
            background: `linear-gradient(135deg, ${templateConfig.backgroundConfig.gradient.from} 0%, ${templateConfig.backgroundConfig.gradient.to} 100%)`
          };
        }
        return {};
      case 'image':
        return {
          backgroundImage: `linear-gradient(${effectiveTemplate.backgroundOverlay || 'rgba(0,0,0,0.3)'}, ${effectiveTemplate.backgroundOverlay || 'rgba(0,0,0,0.3)'}), url(${effectiveTemplate.backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      case 'animated':
        return {
          backgroundColor: templateConfig?.backgroundConfig?.baseColor || '#000000'
        };
      default:
        return {};
    }
  };
  
  // Add some sample links if none are provided
  const sampleLinks = links && links.length > 0 ? links : [
    { id: '1', title: 'Sample Link 1', url: 'https://example.com', icon: 'globe' },
    { id: '2', title: 'Sample Link 2', url: 'https://example.com', icon: 'link' }
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

  // Determine text color based on background
  const getTextColor = () => {
    if (template === 'elegant-dark' || effectiveTemplate.backgroundType === 'image') {
      return 'text-white';
    }
    if (template === 'gradient' || (effectiveTemplate.backgroundType === 'animated')) {
      return 'text-white';
    }
    return '';
  };

  const textColorClass = getTextColor();

  return (
    <div 
      className={`rounded-md overflow-hidden h-full relative ${styles.background}`}
      style={getBackgroundStyle()}
    >
      {/* Render animated background if needed */}
      {effectiveTemplate.backgroundType === 'animated' && renderAnimationBackground(template, { animation_type: effectiveTemplate.animationType })}
      
      <div className={`${styles.container} ${fontClass} ${textColorClass}`}>
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
          {sampleLinks.map((link) => (
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
    </div>
  );
};
