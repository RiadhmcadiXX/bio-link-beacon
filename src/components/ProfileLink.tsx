import React from "react";
import { EmbedVideo } from "@/components/EmbedVideo";
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
  Package,
  Video
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
    isEmbed?: boolean;
    embedType?: string;
    position?: number;
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
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  // Get template-based styles that match LivePreview exactly
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          containerClass: 'bg-white shadow-sm border hover:shadow transition-shadow rounded-lg p-4',
          textColor: 'text-gray-800'
        };
      case 'elegant-dark':
        return {
          containerClass: 'bg-gray-800 text-white hover:bg-gray-700 rounded-lg p-4',
          textColor: 'text-white'
        };
      case 'gradient':
        return {
          containerClass: 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-lg p-4',
          textColor: 'text-white'
        };
      case 'bubbles':
        return {
          containerClass: 'bg-white rounded-full shadow-md hover:shadow-lg p-4',
          textColor: 'text-gray-800'
        };
      case 'modern':
        return {
          containerClass: 'bg-white shadow rounded-md hover:shadow-md border-l-4 border-gray-300 p-4',
          textColor: 'text-gray-800'
        };
      case 'floating-particles':
      case 'wave-background':
      case 'gradient-flow':
      case 'blue-flow':
        return {
          containerClass: 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-lg p-4',
          textColor: 'text-white'
        };
      case 'custom':
        return getCustomTemplateStyles();
      default:
        return {
          containerClass: 'bg-white/10 hover:bg-white/20 rounded-lg p-4',
          textColor: 'text-gray-800'
        };
    }
  };

  // Get custom template styles based on theme
  const getCustomTemplateStyles = () => {
    if (buttonStyle === 'gradient' && gradientFrom && gradientTo) {
      return {
        containerClass: 'text-white rounded-lg p-4',
        textColor: 'text-white'
      };
    }

    // Check if themeColor is a hex color
    if (themeColor?.startsWith('#')) {
      return {
        containerClass: 'text-white rounded-lg p-4',
        textColor: 'text-white'
      };
    }

    switch (themeColor) {
      case 'blue':
        return {
          containerClass: 'bg-brand-blue/10 hover:bg-brand-blue/20 rounded-lg p-4',
          textColor: 'text-brand-blue'
        };
      case 'pink':
        return {
          containerClass: 'bg-brand-pink/10 hover:bg-brand-pink/20 rounded-lg p-4',
          textColor: 'text-brand-pink'
        };
      case 'orange':
        return {
          containerClass: 'bg-brand-orange/10 hover:bg-brand-orange/20 rounded-lg p-4',
          textColor: 'text-brand-orange'
        };
      default: // purple
        return {
          containerClass: 'bg-brand-purple/10 hover:bg-brand-purple/20 rounded-lg p-4',
          textColor: 'text-brand-purple'
        };
    }
  };

  // Get button style classes that override template styles when needed
  const getButtonStyleOverrides = () => {
    switch (buttonStyle) {
      case 'rounded':
        return "rounded-full";
      case 'outline':
        return "bg-transparent border-2 border-current";
      case 'minimal':
        return "bg-transparent hover:underline shadow-none";
      case 'shadow':
        return "shadow-md hover:shadow-lg";
      default:
        return "";
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

  // If this is an embed link, render the embedded content
  if (link.isEmbed) {
    return (
      <div className="mb-4 w-full" onClick={onClick}>
        <EmbedVideo 
          url={link.url}
          title={link.title}
          isCollapsible={link.embedType === 'collapsible'}
          themeColor={themeColor}
        />
      </div>
    );
  }

  // Render social icon for horizontal icons list
  if (link.linkType === 'social' && layout === 'icons') {
    const styles = getTemplateStyles();
    return (
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/20 ${getFontFamilyClasses()} transition-all duration-200 transform hover:scale-110 mx-1`}
        onClick={(e) => {
          onClick();
        }}
        style={getGradientStyle()}
      >
        <div className={styles.textColor}>{renderIcon()}</div>
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
  const styles = getTemplateStyles();
  const buttonOverrides = getButtonStyleOverrides();
  const fontClasses = getFontFamilyClasses();

  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`block ${styles.containerClass} ${buttonOverrides} ${fontClasses} transition-all duration-200 transform hover:scale-[1.01]`}
      onClick={(e) => {
        onClick();
      }}
      style={getGradientStyle()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-3 ${styles.textColor}`}>{renderIcon()}</div>
          <div>
            <span className={`font-medium ${styles.textColor}`}>{link.title}</span>
            {link.description && isProduct && (
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {link.price && isProduct && (
            <span className="mr-3 font-medium text-green-600">{link.price}</span>
          )}
          <ExternalLink className={`h-4 w-4 ${styles.textColor === 'text-white' ? 'text-white/70' : 'text-gray-400'}`} />
        </div>
      </div>
    </a>
  );
};
