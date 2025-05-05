import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  profile: {
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    theme?: string | null;
    button_style?: string | null;
    font_family?: string | null;
    customColor?: string | null;
    gradientFrom?: string | null;
    gradientTo?: string | null;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon: string;
    linkType?: string;
    clicks?: number;
  }>;
  onApply: () => void;
}

export const TemplatePreview = ({
  isOpen,
  onClose,
  template,
  profile,
  links,
  onApply
}: TemplatePreviewProps) => {
  
  // Generate preview styles based on template
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          background: 'bg-white',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-16 w-16',
          header: 'text-center mb-6',
          title: 'text-xl font-semibold',
          bio: 'text-sm text-gray-500',
          links: 'space-y-2'
        };
      case 'elegant-dark':
        return {
          background: 'bg-gray-900',
          container: 'max-w-md mx-auto px-6 py-10',
          avatar: 'h-20 w-20 ring-2 ring-gray-800',
          header: 'text-center mb-8 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-gray-400',
          links: 'space-y-3'
        };
      case 'gradient':
        return {
          background: 'bg-gradient-to-br from-purple-500 to-pink-500',
          container: 'max-w-md mx-auto px-5 py-8',
          avatar: 'h-24 w-24 ring-4 ring-white/20',
          header: 'text-center mb-6 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-white/80',
          links: 'space-y-3'
        };
      case 'bubbles':
        return {
          background: 'bg-blue-50',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20 border-4 border-blue-200',
          header: 'text-center mb-8',
          title: 'text-2xl font-bold text-blue-800',
          bio: 'text-sm text-blue-600',
          links: 'space-y-4'
        };
      case 'modern':
        return {
          background: 'bg-gray-100',
          container: 'max-w-md mx-auto px-4 py-10',
          avatar: 'h-24 w-24',
          header: 'text-left mb-8 flex items-center gap-4',
          title: 'text-xl font-bold',
          bio: 'text-sm text-gray-600 mt-1',
          links: 'space-y-3'
        };
      case 'custom':
        // For custom template, use theme from profile settings
        // Check if using custom gradient
        if (profile.gradientFrom && profile.gradientTo) {
          return {
            background: '', // We'll use inline style for gradient
            container: 'max-w-md mx-auto px-4 py-8',
            avatar: 'h-20 w-20',
            header: 'text-center mb-6',
            title: 'text-xl font-bold',
            bio: 'text-gray-600 text-sm',
            links: 'space-y-3'
          };
        }
        
        const themeColor = profile.theme || 'purple';
        return {
          background: profile.customColor ? '' : `bg-gradient-to-br ${
            themeColor === 'purple' ? 'from-purple-100 to-purple-200' :
            themeColor === 'blue' ? 'from-blue-100 to-blue-200' :
            themeColor === 'pink' ? 'from-pink-100 to-pink-200' :
            'from-orange-100 to-orange-200'
          }`,
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20',
          header: 'text-center mb-6',
          title: 'text-xl font-bold',
          bio: 'text-gray-600 text-sm',
          links: 'space-y-3'
        };
      default: // default template
        return {
          background: 'bg-gradient-to-br from-purple-50 to-purple-100',
          container: 'max-w-md mx-auto px-4 py-8',
          avatar: 'h-20 w-20',
          header: 'text-center mb-6',
          title: 'text-xl font-bold',
          bio: 'text-gray-600 text-sm',
          links: 'space-y-3'
        };
    }
  };

  // Generate custom background style if needed
  const getCustomBackgroundStyle = () => {
    if (template === 'custom') {
      if (profile.gradientFrom && profile.gradientTo) {
        return {
          background: `linear-gradient(135deg, ${profile.gradientFrom} 0%, ${profile.gradientTo} 100%)`
        };
      } else if (profile.customColor) {
        return {
          backgroundColor: profile.customColor
        };
      }
    }
    return {};
  };

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
  
  const styles = getTemplateStyles();
  

  // Determine theme color for links based on template or profile theme
  const getThemeColor = () => {
    if (template === 'custom') {
      return profile.customColor || profile.theme || 'purple';
    }
    
    switch (template) {
      case 'elegant-dark': return 'blue';
      case 'gradient': return 'pink';
      case 'bubbles': return 'blue';
      case 'modern': return 'orange';
      default: return 'purple';
    }
  };

  // Get button style based on template or profile settings
  const getButtonStyle = () => {
    if (template === 'custom') {
      return profile.button_style || 'default';
    }
    
    switch (template) {
      case 'minimal': return 'minimal';
      case 'elegant-dark': return 'outline';
      case 'gradient': return 'gradient';
      case 'bubbles': return 'rounded';
      case 'modern': return 'shadow';
      default: return 'default';
    }
  };

  // Get font family based on template or profile settings
  const getFontFamily = () => {
    if (template === 'custom') {
      return profile.font_family || 'default';
    }
    
    switch (template) {
      case 'elegant-dark': return 'roboto';
      case 'gradient': return 'display';
      case 'bubbles': return 'lobster';
      case 'modern': return 'mono';
      default: return 'default';
    }
  };

  const fontClass = fontClassMap[getFontFamily()] || "font-sans";

  const handleLinkClick = () => {
    // Prevent actual navigation in preview mode
    return;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">
              Preview Template: {
                template === 'custom' 
                ? 'Custom' 
                : template.charAt(0).toUpperCase() + template.slice(1)
              }
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <div 
              className={`${styles.background} min-h-full ${fontClass}`}
              style={getCustomBackgroundStyle()}
            >
              <div className={styles.container}>
                {template === 'modern' ? (
                  <div className={styles.header}>
                    <Avatar className={styles.avatar}>
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
                      <AvatarFallback>{(profile.display_name || profile.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className={styles.title}>{profile.display_name || profile.username}</h1>
                      {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                    </div>
                  </div>
                ) : (
                  <div className={styles.header}>
                    <Avatar className={`mx-auto mb-4 ${styles.avatar}`}>
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
                      <AvatarFallback>{(profile.display_name || profile.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className={styles.title}>{profile.display_name || profile.username}</h1>
                    {profile.bio && <p className={`mt-2 ${styles.bio}`}>{profile.bio}</p>}
                  </div>
                )}

                <div className={styles.links}>
                  {links.length > 0 ? (
                    links.map((link) => (
                      <ProfileLink 
                        key={link.id} 
                        link={link} 
                        themeColor={getThemeColor()}
                        buttonStyle={getButtonStyle()}
                        fontFamily={getFontFamily()}
                        onClick={handleLinkClick} 
                        template={template}
                        gradientFrom={profile.gradientFrom || undefined}
                        gradientTo={profile.gradientTo || undefined}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No links available</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <Button className="bg-brand-purple hover:bg-brand-purple/90" onClick={onApply}>
              {template === 'custom' ? 'Apply Custom Settings' : 'Apply This Template'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
