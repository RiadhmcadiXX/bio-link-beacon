
import React from "react";
import { 
  ExternalLink, 
  Link2, 
  Twitter, 
  Youtube, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Globe,
  Mail,
  Phone,
  ShoppingCart,
  Package
} from "lucide-react";

interface ProfileLinkProps {
  link: {
    id: string;
    title: string;
    url: string;
    icon: string;
    linkType?: string;
    clicks?: number;
  };
  themeColor: string;
  onClick: () => void;
  template?: string;
  buttonStyle?: string;
  fontFamily?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const ProfileLink = ({ 
  link, 
  themeColor, 
  onClick, 
  template = 'default',
  buttonStyle = 'default',
  fontFamily = 'default',
  gradientFrom,
  gradientTo
}: ProfileLinkProps) => {
  // Function to render icon based on link.icon
  const renderIcon = () => {
    switch (link.icon) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'globe':
        return <Globe className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'shopping-cart':
        return <ShoppingCart className="h-5 w-5" />;
      case 'package':
        return <Package className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  // Get theme-based styles
  const getThemeStyles = () => {
    switch (themeColor) {
      case 'blue':
        return { bg: 'bg-brand-blue/10 hover:bg-brand-blue/20', text: 'text-brand-blue' };
      case 'pink':
        return { bg: 'bg-brand-pink/10 hover:bg-brand-pink/20', text: 'text-brand-pink' };
      case 'orange':
        return { bg: 'bg-brand-orange/10 hover:bg-brand-orange/20', text: 'text-brand-orange' };
      default: // purple
        return { bg: 'bg-brand-purple/10 hover:bg-brand-purple/20', text: 'text-brand-purple' };
    }
  };

  // Get special styles for social and product links
  const getLinkTypeStyles = () => {
    if (link.linkType === 'social') {
      return 'border-l-4 border-blue-400';
    } else if (link.linkType === 'product') {
      return 'border-l-4 border-green-400';
    }
    return '';
  };

  // Get button style classes
  const getButtonStyleClasses = () => {
    switch (buttonStyle) {
      case 'rounded':
        return "rounded-full bg-white";
      case 'outline':
        return "bg-transparent border-2 border-current";
      case 'gradient':
        return `bg-gradient-to-r ${
          themeColor === 'purple' ? 'from-purple-500 to-pink-500' :
          themeColor === 'blue' ? 'from-blue-500 to-cyan-400' :
          themeColor === 'pink' ? 'from-pink-500 to-red-400' :
          'from-orange-500 to-amber-400'
        } text-white`;
      case 'minimal':
        return "bg-transparent hover:underline shadow-none p-2";
      case 'shadow':
        return "bg-white shadow-md hover:shadow-lg";
      default:
        return ""; // Default style is already in the main classes
    }
  };

  // Get font family classes
  const getFontFamilyClasses = () => {
    switch (fontFamily) {
      case 'serif':
        return "font-serif";
      case 'mono':
        return "font-mono";
      case 'display':
        return "font-bold tracking-wide";
      case 'handwritten':
        return "italic";
      default:
        return "font-sans";
    }
  };

  // Get template-specific styles
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return "bg-white shadow-sm border hover:shadow transition-shadow";
      case 'elegant-dark':
        return "bg-gray-800 text-white hover:bg-gray-700";
      case 'gradient':
        return "bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white";
      case 'bubbles':
        return "bg-white rounded-full shadow-md hover:shadow-lg";
      case 'modern':
        return "bg-white shadow rounded-md hover:shadow-md border-l-4 border-gray-300";
      case 'custom':
        return getButtonStyleClasses(); // For custom template, prioritize button styles
      default:
        return ""; // Default style is already in the main classes
    }
  };

  const themeStyles = getThemeStyles();
  const templateSpecificStyles = getTemplateStyles();
  const fontFamilyClasses = getFontFamilyClasses();

  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`block ${themeStyles.bg} ${getLinkTypeStyles()} ${templateSpecificStyles} ${fontFamilyClasses} rounded-lg p-4 transition-all duration-200 transform hover:scale-[1.01]`}
      onClick={(e) => {
        onClick();
        // Let the default navigation happen
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-3 ${themeStyles.text}`}>{renderIcon()}</div>
          <span className="font-medium">{link.title}</span>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </div>
    </a>
  );
};
