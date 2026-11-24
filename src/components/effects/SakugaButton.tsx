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
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base gap-2.5 rounded-2xl',
  }[size];

  // Variants
  const variantClasses = {
    primary: 'bg-[#FC75B4]/20 text-[#FC75B4] border border-[#FC75B4]/50 hover:bg-[#FC75B4]/30 hover:border-[#FC75B4] hover:shadow-[0_0_20px_rgba(252,117,180,0.35)]',
    secondary: 'bg-[#474329]/40 text-[#F0E5DB] border border-[#756f45]/60 hover:bg-[#474329]/70 hover:border-[#F0E5DB]/40 hover:text-white',
    accent: 'bg-gradient-to-r from-[#FC75B4]/25 to-[#756f45]/30 text-[#F0E5DB] border border-[#FC75B4]/50 hover:from-[#FC75B4]/35 hover:to-[#756f45]/50 hover:border-[#FC75B4] hover:shadow-[0_0_25px_rgba(252,117,180,0.35)]',
    ghost: 'bg-transparent text-slate-300 hover:text-[#FC75B4] hover:bg-[#FC75B4]/10 border border-transparent',
    outline: 'bg-transparent text-[#F0E5DB] border border-[#756f45] hover:border-[#FC75B4]/80 hover:text-[#FC75B4] hover:bg-[#FC75B4]/10',
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
