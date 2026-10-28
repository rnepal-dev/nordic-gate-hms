import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className = '',
  containerClassName = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]"
        >
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center bg-white rounded-lg border transition-all duration-150 px-3 py-2 text-xs sm:text-sm ${
          error
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-600'
            : 'border-[#D3C8B9] focus-within:ring-2 focus-within:ring-[#BF8641]/20 focus-within:border-[#BF8641]'
        } ${disabled ? 'bg-stone-50 cursor-not-allowed opacity-60' : ''}`}
      >
        <select
          id={selectId}
          disabled={disabled}
          className={`w-full bg-transparent text-[#02070D] focus:outline-none appearance-none pr-6 cursor-pointer disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 pointer-events-none shrink-0" />
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-600 leading-tight">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500 leading-tight">{helperText}</p>
      ) : null}
    </div>
  );
};
