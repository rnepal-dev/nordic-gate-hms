import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#02070D]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${sizeClasses[size]} bg-white border-l border-[#D3C8B9] shadow-2xl flex flex-col transform transition-transform ease-out duration-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#EDE7DC] bg-[#F8F5EF]/80">
            <div>
              {title && (
                <h3 className="text-lg font-bold text-[#0D1A26] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-xs text-[#5D6B78]">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-[#0D1A26] hover:bg-[#EDE7DC] rounded-lg transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-[#25303A]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EDE7DC] bg-[#F8F5EF]/60">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
