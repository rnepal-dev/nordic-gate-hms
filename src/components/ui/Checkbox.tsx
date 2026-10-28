import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled,
  className = '',
  id,
  ...props
}) => {
  return (
    <label
      className={`inline-flex items-start gap-2.5 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          id={id}
          {...props}
        />
        <div
          className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
            checked
              ? 'bg-[#BF8641] border-[#BF8641] text-white shadow-xs'
              : 'bg-white border-[#D3C8B9] hover:border-[#BF8641]'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="space-y-0.5">
          {label && <span className="block text-xs font-semibold text-[#02070D]">{label}</span>}
          {description && (
            <span className="block text-[11px] text-stone-500 leading-snug">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};
