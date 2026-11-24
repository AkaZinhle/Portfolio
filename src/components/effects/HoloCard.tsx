import React, { useRef, useState, useCallback } from 'react';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  className = '',
  intensity = 1,
  interactive = true,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [holoStyle, setHoloStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt angles (max ~10 degrees)
    const rotateX = ((centerY - y) / centerY) * 9 * intensity;
    const rotateY = ((x - centerX) / centerX) * 9 * intensity;

    // Normalized coordinates (0 to 100%)
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    // Dynamic diffraction angle
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 180;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);

    setHoloStyle({
      opacity: 0.65 * intensity,
      background: `
        radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 45%),
        linear-gradient(
          ${angle}deg,
          rgba(255, 0, 128, 0.12) 0%,
          rgba(0, 255, 255, 0.14) 25%,
          rgba(128, 0, 255, 0.12) 50%,
          rgba(255, 215, 0, 0.12) 75%,
          rgba(0, 255, 128, 0.12) 100%
        )
      `,
      backgroundBlendMode: 'color-dodge, overlay',
    });
  }, [interactive, intensity]);

  const handleMouseEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setHoloStyle({ opacity: 0, transition: 'opacity 0.5s ease-out' });
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative group transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Underlying Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Holographic Diffraction Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 mix-blend-screen overflow-hidden"
        style={holoStyle}
      />

      {/* Subtle iridescent border rim */}
      <div
        className={`pointer-events-none absolute -inset-[1px] rounded-2xl z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.4), rgba(168, 85, 247, 0.3), rgba(245, 158, 11, 0.3))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
    </div>
  );
};
