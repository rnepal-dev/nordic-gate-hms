import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 h-11',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#BF8641] hover:bg-[#8C5F27] text-white shadow-xs focus-visible:ring-[#BF8641] disabled:bg-[#BF8641]/50',
    secondary: 'bg-[#0D1A26] hover:bg-[#02070D] text-[#F8F5EF] shadow-xs focus-visible:ring-[#0D1A26] disabled:bg-[#0D1A26]/50',
    outline: 'border border-[#D3C8B9] hover:border-[#BF8641] hover:bg-[#F8F5EF] text-[#25303A] hover:text-[#02070D] focus-visible:ring-[#BF8641] disabled:border-stone-200 disabled:text-stone-400',
    ghost: 'text-[#25303A] hover:bg-[#EDE7DC]/60 hover:text-[#02070D] focus-visible:ring-[#BF8641] disabled:text-stone-300',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs focus-visible:ring-rose-600 disabled:bg-rose-300',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
