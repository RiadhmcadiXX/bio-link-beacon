
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
    section?: string;
    description?: string;
    imageUrl?: string;
    price?: string;
  };
  themeColor: string;
  onClick: () => void;
  template?: string;
  buttonStyle?: string;
  fontFamily?: string;
  gradientFrom?: string;
  gradientTo?: string;
  layout?: string;
  isProduct?: boolean;
  cardIndex?: number;
}

export const ProfileLink = ({ 
  link, 
  themeColor, 
  onClick, 
  template = 'default',
  buttonStyle = 'default',
  fontFamily = 'default',
  gradientFrom,
  gradientTo,
  layout = 'list',
  isProduct = false,
  cardIndex
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
    // Check if themeColor is a hex color
    if (themeColor?.startsWith('#')) {
      return { 
        bg: 'bg-white/10 hover:bg-white/20', 
        text: 'text-gray-800' 
      };
    }

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
        if (gradientFrom && gradientTo) {
          return "text-white"; // Custom gradient handled via inline style
        }
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
      case 'inter':
        return "font-inter";
      case 'roboto':
        return "font-roboto";
      case 'poppins':
        return "font-poppins";
      case 'montserrat':
        return "font-montserrat";
      case 'raleway':
        return "font-raleway";
      case 'playfair':
        return "font-playfair";
      case 'lobster':
        return "font-lobster";
      case 'pacifico':
        return "font-pacifico";
      case 'oswald':
        return "font-oswald";
      case 'lato':
        return "font-lato";
      case 'merriweather':
        return "font-merriweather";
      case 'dancing':
        return "font-dancing";
      case 'quicksand':
        return "font-quicksand";
      case 'comfortaa':
        return "font-comfortaa";
      case 'nunito':
        return "font-nunito";
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

  // Get gradient style for the button if using gradient
  const getGradientStyle = () => {
    if (buttonStyle === 'gradient' && gradientFrom && gradientTo) {
      return {
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
      };
    }
    // If using a custom color as theme
    if (themeColor?.startsWith('#')) {
      return {
        backgroundColor: themeColor
      };
    }
    return {};
  };

  // Render social icon for horizontal icons list
  if (link.linkType === 'social' && layout === 'icons') {
    return (
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center p-3 rounded-full ${themeStyles.bg} ${fontFamilyClasses} transition-all duration-200 transform hover:scale-110 mx-1`}
        onClick={(e) => {
          onClick();
        }}
        style={getGradientStyle()}
      >
        <div className={`${themeStyles.text}`}>{renderIcon()}</div>
      </a>
    );
  }

  // Render product card for grid layout
  if (isProduct && layout === 'grid') {
    return (
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] ${cardIndex !== undefined && cardIndex % 2 === 0 ? 'md:mr-2' : 'md:ml-2'}`}
        onClick={(e) => {
          onClick();
        }}
      >
        <div className="relative w-full h-48 bg-gray-200">
          {link.imageUrl ? (
            <img 
              src={link.imageUrl} 
              alt={link.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{link.title}</h3>
            {link.price && <span className="text-green-600 font-medium">{link.price}</span>}
          </div>
          {link.description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{link.description}</p>
          )}
          <div className="flex justify-end mt-3">
            <span className="text-sm text-blue-500 flex items-center">
              View details <ExternalLink className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
      </a>
    );
  }

  // Default list style for all other links
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
      style={getGradientStyle()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-3 ${themeStyles.text}`}>{renderIcon()}</div>
          <div>
            <span className="font-medium">{link.title}</span>
            {link.description && isProduct && (
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {link.price && isProduct && (
            <span className="mr-3 font-medium text-green-600">{link.price}</span>
          )}
          <ExternalLink className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </a>
  );
};
