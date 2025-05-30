
import React from "react";
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube,
  Globe
} from "lucide-react";

interface SocialIconsProps {
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    position?: number;
    socialPosition?: string;
  }>;
  onClick: (linkId: string) => void;
  themeColor: string;
}

export const SocialIcons = ({ links, onClick, themeColor }: SocialIconsProps) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'website':
        return <Globe className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getThemeClasses = () => {
    switch (themeColor) {
      case 'blue':
        return 'bg-brand-blue text-white hover:bg-brand-blue/80';
      case 'pink':
        return 'bg-brand-pink text-white hover:bg-brand-pink/80';
      case 'orange':
        return 'bg-brand-orange text-white hover:bg-brand-orange/80';
      default: // purple
        return 'bg-brand-purple text-white hover:bg-brand-purple/80';
    }
  };

  const getCustomStyles = () => {
    if (themeColor?.startsWith('#')) {
      return {
        backgroundColor: themeColor,
        color: 'white'
      };
    }
    return undefined;
  };

  const isCustomColor = themeColor?.startsWith('#');
  const themeClasses = getThemeClasses();
  const customStyles = getCustomStyles();

  return (
    <div className="flex justify-center space-x-3 my-6">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
            isCustomColor ? '' : themeClasses
          }`}
          style={customStyles}
          onClick={(e) => {
            onClick(link.id);
          }}
          title={link.title}
        >
          {renderIcon(link.icon)}
        </a>
      ))}
    </div>
  );
};
