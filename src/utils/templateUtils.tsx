// utils/templateUtils.ts

import { WaveAnimation } from "@/components/animations/WaveAnimation";
import { ParticlesAnimation } from "@/components/animations/ParticlesAnimation";
import { GradientFlowAnimation } from "@/components/animations/GradientFlowAnimation";

interface Profile {
  template?: string | null;
  animation_type?: string | null;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  customColor?: string | null;
}

// Determine if the current template has animations
export const hasAnimation = (template: string, profile: Profile): boolean => {
  return (
    template === 'floating-particles' ||
    template === 'wave-background' ||
    template === 'gradient-flow' ||
    (template === 'custom' && !!profile.animation_type)
  );
};

// Get animation type
export const getAnimationType = (template: string, profile: Profile): string | null => {
  if (template === 'custom') {
    return profile.animation_type || null;
  }

  switch (template) {
    case 'floating-particles': return 'particles';
    case 'wave-background': return 'waves';
    case 'gradient-flow': return 'gradientFlow';
    default: return null;
  }
};

// Render animation component
export const renderAnimation = (template: string, profile: Profile) => {
  const type = getAnimationType(template, profile);

  switch (type) {
    case 'waves':
      return <WaveAnimation />;
    case 'particles':
      return <ParticlesAnimation />;
    case 'gradientFlow':
      return <GradientFlowAnimation fromColor="#00B4DB" toColor="#0083B0" speed={0.3} />;
    default:
      return null;
  }
};

// Optional: Get inline background for "custom" template
export const getCustomBackgroundStyle = (template: string, profile: Profile) => {
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
