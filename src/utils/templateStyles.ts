
interface TemplateStyles {
  background: string;
  container: string;
  avatar: string;
  header: string;
  title: string;
  bio: string;
  links: string;
  themeColor: string;
  buttonStyle: string;
  fontFamily: string;
}

interface TemplateConfig {
  name: string;
  buttonStyle: string;
  fontFamily: string;
  themeColor: string;
  backgroundType: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundOverlay?: string;
  hasAnimation: boolean;
  animationType?: string;
  customColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const getTemplateStyles = (
  template: string,
  templateConfig?: TemplateConfig
): TemplateStyles => {
  // Use template config data if available
  const effectiveTheme = templateConfig?.themeColor || 'purple';
  const effectiveButtonStyle = templateConfig?.buttonStyle || 'default';
  const effectiveFontFamily = templateConfig?.fontFamily || 'default';

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
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle || 'minimal',
        fontFamily: effectiveFontFamily,
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
        buttonStyle: effectiveButtonStyle || 'outline',
        fontFamily: effectiveFontFamily || 'serif',
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
        buttonStyle: effectiveButtonStyle || 'gradient',
        fontFamily: effectiveFontFamily || 'display',
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
        buttonStyle: effectiveButtonStyle || 'rounded',
        fontFamily: effectiveFontFamily || 'handwritten',
      };

    case 'modern':
      return {
        background: 'bg-gray-100',
        container: 'max-w-md mx-auto px-4 py-10',
        avatar: 'h-20 w-20',
        header: 'text-left mb-8 flex items-center gap-4',
        title: 'text-xl font-bold',
        bio: 'text-sm text-gray-600 mt-1',
        links: 'space-y-3',
        themeColor: 'orange',
        buttonStyle: effectiveButtonStyle || 'shadow',
        fontFamily: effectiveFontFamily || 'mono',
      };

    case 'gradient-flow':
      return {
        background: 'bg-[#4b0082]',
        container: 'max-w-md mx-auto px-5 py-8 relative z-10',
        avatar: 'h-20 w-20 ring-2 ring-white/30',
        header: 'text-center mb-6 text-white',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-white/80',
        links: 'space-y-3',
        themeColor: 'purple',
        buttonStyle: effectiveButtonStyle || 'minimal',
        fontFamily: effectiveFontFamily || 'lobster',
      };

    case 'blue-flow':
      return {
        background: 'bg-[#1E3A8A]',
        container: 'max-w-md mx-auto px-5 py-8 relative z-10',
        avatar: 'h-20 w-20 ring-2 ring-white/30',
        header: 'text-center mb-6 text-white',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-white/80',
        links: 'space-y-3',
        themeColor: 'blue',
        buttonStyle: effectiveButtonStyle || 'modern',
        fontFamily: effectiveFontFamily || 'lobster',
      };

    case 'floating-particles':
      return {
        background: 'bg-[#000022]',
        container: 'max-w-md mx-auto px-5 py-8 relative z-10',
        avatar: 'h-20 w-20 ring-2 ring-white/30',
        header: 'text-center mb-6 text-white',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-white/80',
        links: 'space-y-3',
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle || 'gradient',
        fontFamily: effectiveFontFamily || 'raleway',
      };

    case 'wave-background':
      return {
        background: 'bg-[#003366]',
        container: 'max-w-md mx-auto px-5 py-8 relative z-10',
        avatar: 'h-20 w-20 ring-2 ring-white/30',
        header: 'text-center mb-6 text-white',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-white/80',
        links: 'space-y-3',
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle || 'default',
        fontFamily: effectiveFontFamily || 'poppins',
      };

    case 'nature-scene':
      return {
        background: 'bg-[#000022]',
        container: 'max-w-md mx-auto px-5 py-8 relative z-10',
        avatar: 'h-20 w-20 ring-2 ring-white/30',
        header: 'text-center mb-6 text-white',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-white/80',
        links: 'space-y-3',
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle || 'shadow',
        fontFamily: effectiveFontFamily || 'poppins',
      };

    case 'custom':
      return {
        background: templateConfig?.customColor ? '' : `bg-gradient-to-br ${
          effectiveTheme === 'purple' ? 'from-purple-100 to-purple-200' :
          effectiveTheme === 'blue' ? 'from-blue-100 to-blue-200' :
          effectiveTheme === 'pink' ? 'from-pink-100 to-pink-200' :
          'from-orange-100 to-orange-200'
        }`,
        container: 'max-w-md mx-auto px-4 py-8 relative z-10',
        avatar: 'h-20 w-20',
        header: 'text-center mb-6',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-gray-600',
        links: 'space-y-3',
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle,
        fontFamily: effectiveFontFamily,
      };

    default: // default template
      return {
        background: `bg-gradient-to-br from-${effectiveTheme}-50 to-${effectiveTheme}-100`,
        container: 'max-w-md mx-auto px-4 py-8 relative z-10',
        avatar: 'h-20 w-20',
        header: 'text-center mb-6',
        title: 'text-2xl font-bold',
        bio: 'text-sm text-gray-600',
        links: 'space-y-3',
        themeColor: effectiveTheme,
        buttonStyle: effectiveButtonStyle,
        fontFamily: effectiveFontFamily,
      };
  }
};

export const getBackgroundStyle = (
  template: string,
  templateConfig?: TemplateConfig
) => {
  if (template === 'custom' && templateConfig) {
    if (templateConfig.gradientFrom && templateConfig.gradientTo) {
      return {
        background: `linear-gradient(135deg, ${templateConfig.gradientFrom} 0%, ${templateConfig.gradientTo} 100%)`
      };
    } else if (templateConfig.customColor) {
      return {
        backgroundColor: templateConfig.customColor
      };
    }
    return {};
  }

  if (!templateConfig) return {};

  switch (templateConfig.backgroundType) {
    case 'color':
      return {
        backgroundColor: templateConfig.backgroundColor || '#ffffff'
      };
    case 'gradient':
      if (templateConfig.gradientFrom && templateConfig.gradientTo) {
        return {
          background: `linear-gradient(135deg, ${templateConfig.gradientFrom} 0%, ${templateConfig.gradientTo} 100%)`
        };
      }
      return {};
    case 'image':
      return {
        backgroundImage: `linear-gradient(${templateConfig.backgroundOverlay || 'rgba(0,0,0,0.3)'}, ${templateConfig.backgroundOverlay || 'rgba(0,0,0,0.3)'}), url(${templateConfig.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    case 'animated':
      return {
        backgroundColor: templateConfig.backgroundColor || '#000000'
      };
    default:
      return {};
  }
};

export const getTextColor = (template: string, templateConfig?: TemplateConfig) => {
  if (template === 'elegant-dark' || templateConfig?.backgroundType === 'image') {
    return 'text-white';
  }
  if (template === 'gradient' || templateConfig?.backgroundType === 'animated') {
    return 'text-white';
  }
  return '';
};
