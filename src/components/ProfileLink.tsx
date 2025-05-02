
import React from "react";
import { ExternalLink, Link2, Twitter, Youtube } from "lucide-react";

interface ProfileLinkProps {
  link: {
    id: string;
    title: string;
    url: string;
    icon: string;
  };
  themeColor: string;
  onClick: () => void;
}

export const ProfileLink = ({ link, themeColor, onClick }: ProfileLinkProps) => {
  // Function to render icon based on link.icon
  const renderIcon = () => {
    switch (link.icon) {
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
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

  const themeStyles = getThemeStyles();

  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`block ${themeStyles.bg} rounded-lg p-4 transition-all duration-200 transform hover:scale-[1.01]`}
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
