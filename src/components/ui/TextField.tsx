import React, { useId } from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  containerClassName = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]"
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center bg-white rounded-lg border transition-all duration-150 px-3 py-2 text-xs sm:text-sm ${
          error
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-600'
            : 'border-[#D3C8B9] focus-within:ring-2 focus-within:ring-[#BF8641]/20 focus-within:border-[#BF8641]'
        } ${disabled ? 'bg-stone-50 cursor-not-allowed opacity-60' : ''}`}
      >
        {leftIcon && <span className="mr-2.5 text-stone-400 shrink-0">{leftIcon}</span>}
        <input
          id={inputId}
          disabled={disabled}
          className={`w-full bg-transparent text-[#02070D] placeholder:text-stone-400 focus:outline-none disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {rightIcon && <span className="ml-2 text-stone-400 shrink-0">{rightIcon}</span>}
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 leading-tight">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500 leading-tight">{helperText}</p>
      ) : null}
    </div>
  );
};
