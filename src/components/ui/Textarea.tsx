import React, { useId, forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  helperText,
  error,
  id,
  className = '',
  containerClassName = '',
  disabled,
  rows = 4,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]"
        >
          {label}
        </label>
      )}

      <div
        className={`bg-white rounded-lg border transition-all duration-150 p-2.5 text-xs sm:text-sm ${
          error
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-600'
            : 'border-[#D3C8B9] focus-within:ring-2 focus-within:ring-[#BF8641]/20 focus-within:border-[#BF8641]'
        } ${disabled ? 'bg-stone-50 cursor-not-allowed opacity-60' : ''}`}
      >
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={`w-full bg-transparent text-[#02070D] placeholder:text-stone-400 focus:outline-none resize-y disabled:cursor-not-allowed ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 leading-tight">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500 leading-tight">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
