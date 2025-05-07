import React, { useEffect, useRef } from "react";
import tinycolor from "tinycolor2"; // npm i tinycolor2

interface GradientFlowProps {
  fromColor?: string;
  toColor?: string;
  speed?: number; // e.g., 0.5 for slow, 2 for fast
}

export const LightBlueToBlue_template = ({
  fromColor = "#6a11cb",
  toColor = "#2575fc",
  speed = 0.5,
}: GradientFlowProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const progress = progressRef.current;

      // Interpolate color
      const interpolated = tinycolor.mix(fromColor, toColor, progress).toHexString();

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, interpolated);
      gradient.addColorStop(1, toColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update progress
      progressRef.current += speed * directionRef.current;
      if (progressRef.current >= 100 || progressRef.current <= 0) {
        directionRef.current *= -1;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fromColor, toColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};
