// utils/templateUtils.ts (or templateAnimations.ts)

import { WaveAnimation } from "@/components/animations/WaveAnimation";
import { ParticlesAnimation } from "@/components/animations/ParticlesAnimation";
import { GradientFlowAnimation } from "@/components/animations/GradientFlowAnimation";
import { LightBlueToBlue_template } from "@/components/animations/LightBlueToBlue_template";

export const getAnimationType = (template: string, profile?: any): string | null => {
  if (template === 'custom' && profile?.animation_type) {
    return profile.animation_type;
  }

  switch (template) {
    case 'floating-particles': return 'particles';
    case 'wave-background': return 'waves';
    case 'gradient-flow': return 'gradientFlow';
    case 'blue-flow': return 'gradientBlueFlow';
    default: return null;
  }
};

export const renderAnimationBackground = (template: string, profile?: any) => {
  const animationType = getAnimationType(template, profile);

  switch (animationType) {
    case 'waves':
      return <WaveAnimation />;
    case 'particles':
      return <ParticlesAnimation />;
    case 'gradientFlow':
      return <GradientFlowAnimation />;
    case 'gradientBlueFlow':
      return <LightBlueToBlue_template />;
    default:
      return null;
  }
};
