
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLink } from "@/components/ProfileLink";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveAnimation } from "./animations/WaveAnimation";

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
    animationType?: string | null;
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

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
      case 'floating-particles':
        return {
          background: 'bg-[#000022]',
          container: 'max-w-md mx-auto px-5 py-8 relative z-10',
          avatar: 'h-20 w-20 ring-2 ring-white/30',
          header: 'text-center mb-6 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-white/80',
          links: 'space-y-3'
        };
      case 'wave-background':
        return {
          background: 'bg-[#003366]',
          container: 'max-w-md mx-auto px-5 py-8 relative z-10',
          avatar: 'h-20 w-20 ring-2 ring-white/30',
          header: 'text-center mb-6 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-white/80',
          links: 'space-y-3'
        };
      case 'gradient-flow':
        return {
          background: 'bg-[#4b0082]',
          container: 'max-w-md mx-auto px-5 py-8 relative z-10',
          avatar: 'h-20 w-20 ring-2 ring-white/30',
          header: 'text-center mb-6 text-white',
          title: 'text-2xl font-bold',
          bio: 'text-sm text-white/80',
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
          background: profile.customColor ? '' : `bg-gradient-to-br ${themeColor === 'purple' ? 'from-purple-100 to-purple-200' :
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

  // Check if template has animation
  const hasAnimation = () => {
    return template === 'floating-particles' ||
      template === 'wave-background' ||
      template === 'gradient-flow' ||
      (template === 'custom' && profile.animationType);
  };

  // Get animation type
  const getAnimationType = () => {
    if (template === 'custom') {
      return profile.animationType;
    }

    switch (template) {
      case 'floating-particles': return 'particles';
      case 'wave-background': return 'waves';
      case 'gradient-flow': return 'gradientFlow';
      default: return null;
    }
  };

  // Particles animation
  const drawParticles = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{ x: number, y: number, size: number, speedX: number, speedY: number, opacity: number }> = [];
    const particleCount = 50;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach(particle => {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Reset if out of bounds
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };



  // Gradient flow animation
  const drawGradientFlow = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hue = 0;
    const animate = () => {
      // Create gradient with shifting colors
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${hue}, 100%, 60%)`);
      gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hue = (hue + 0.5) % 360;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Initialize and cleanup animations
  useEffect(() => {
    if (isOpen && hasAnimation() && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const animationType = getAnimationType();
      if (animationType === 'particles') {
        drawParticles(canvas);
      } else if (animationType === 'waves') {
        drawWaves(canvas);
      } else if (animationType === 'gradientFlow') {
        drawGradientFlow(canvas);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, template, profile.animationType]);

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
      case 'floating-particles': return 'blue';
      case 'wave-background': return 'blue';
      case 'gradient-flow': return 'purple';
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
      case 'floating-particles': return 'gradient';
      case 'wave-background': return 'default';
      case 'gradient-flow': return 'minimal';
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
      case 'floating-particles': return 'raleway';
      case 'wave-background': return 'poppins';
      case 'gradient-flow': return 'montserrat';
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
                  : template.charAt(0).toUpperCase() + template.slice(1).replace(/-/g, ' ')
              }
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div
              className={`${styles.background} min-h-full ${fontClass} relative`}
              style={getCustomBackgroundStyle()}
            >
              {getAnimationType() === 'waves' && <WaveAnimation />}
              {getAnimationType() !== 'waves' && (
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              )}

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
