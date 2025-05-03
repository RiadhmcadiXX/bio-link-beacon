
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";

interface LivePreviewProps {
  profile: {
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
}

export const LivePreview = ({
  profile,
  links,
  template,
  themeColor,
  buttonStyle,
  fontFamily
}: LivePreviewProps) => {
  
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
        // For custom template, use theme from profile settings
        return {
          background: `bg-gradient-to-br ${
            themeColor === 'purple' ? 'from-purple-100 to-purple-200' :
            themeColor === 'blue' ? 'from-blue-100 to-blue-200' :
            themeColor === 'pink' ? 'from-pink-100 to-pink-200' :
            'from-orange-100 to-orange-200'
          }`,
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12',
          header: 'text-center mb-4',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-600',
          links: 'space-y-2'
        };
      default: // default template
        return {
          background: 'bg-gradient-to-br from-purple-50 to-purple-100',
          container: 'max-w-full mx-auto px-4 py-6',
          avatar: 'h-12 w-12',
          header: 'text-center mb-4',
          title: 'text-lg font-bold',
          bio: 'text-xs text-gray-600',
          links: 'space-y-2'
        };
    }
  };

  const styles = getTemplateStyles();
  
  const handleLinkClick = (e: React.MouseEvent) => {
    // Prevent navigation in the preview
    e.preventDefault();
  };

  // Add some sample links if none are provided
  const sampleLinks = links && links.length > 0 ? links : [
    { id: '1', title: 'Sample Link 1', url: 'https://example.com', icon: 'globe' },
    { id: '2', title: 'Sample Link 2', url: 'https://example.com', icon: 'link' }
  ];

  return (
    <div className={`rounded-md overflow-hidden h-full ${styles.background}`}>
      <div className={styles.container}>
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
              themeColor={themeColor}
              buttonStyle={buttonStyle}
              fontFamily={fontFamily}
              onClick={() => {}} 
              template={template}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
