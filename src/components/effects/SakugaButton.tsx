import React, { useState, useRef } from 'react';

interface SakugaButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export const SakugaButton: React.FC<SakugaButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isRebounding, setIsRebounding] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
    setIsRebounding(false);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsPressed(false);
    setIsRebounding(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsRebounding(false);
    }, 280);

    if (onClick) onClick(e);
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      setIsPressed(false);
      setIsRebounding(false);
    }
  };

  // Base sizing
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 pixel-corners-sm',
    md: 'px-5 py-2.5 text-sm gap-2 pixel-corners',
    lg: 'px-7 py-3.5 text-base gap-2.5 pixel-corners-lg',
  }[size];

  // Variants
  const variantClasses = {
    primary: 'bg-[#ff9a3c] text-[#0c0a2a] border border-[#ff9a3c] hover:bg-[#e8741a] hover:border-[#e8741a] shadow-[0_0_18px_rgba(255,154,60,0.4)] font-bold active:bg-[#e8741a]',
    secondary: 'bg-[#272343] text-[#fbf1d4] border border-[#4a4378] hover:bg-[#352f5a] hover:border-[#8fc3e8] hover:text-[#fbf1d4] shadow-md',
    accent: 'bg-gradient-to-r from-[#ff9a3c]/25 to-[#4a4378]/40 text-[#fbf1d4] border border-[#ff9a3c]/60 hover:from-[#ff9a3c]/35 hover:to-[#4a4378]/60 hover:border-[#ff9a3c] hover:shadow-[0_0_20px_rgba(255,154,60,0.35)]',
    ghost: 'bg-transparent text-[#b8b0d4] hover:text-[#ff9a3c] hover:bg-[#352f5a] border border-transparent',
    outline: 'bg-[#1b1830]/80 backdrop-blur-sm text-[#fbf1d4] border border-[#4a4378] hover:border-[#ff9a3c] hover:text-[#ff9a3c] hover:bg-[#352f5a]',
  }[variant];

  // Dynamic spring transform
  let transformStyle = 'scale(1)';
  if (isPressed) {
    transformStyle = 'scale(0.93) translateY(2px)';
  } else if (isRebounding) {
    transformStyle = 'scale(1.04) translateY(-1px)';
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`
        relative inline-flex items-center justify-center font-medium font-sans
        transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/50
        disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
      style={{
        transform: transformStyle,
      }}
    >
      {icon && <span className="inline-flex shrink-0 transition-transform duration-150">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
