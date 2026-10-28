import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: Omit<ToastMessage, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
              border: 'border-emerald-200',
              bg: 'bg-emerald-50/95',
            },
            error: {
              icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
              border: 'border-rose-200',
              bg: 'bg-rose-50/95',
            },
            info: {
              icon: <Info className="w-5 h-5 text-[#BF8641] shrink-0" />,
              border: 'border-[#EDE7DC]',
              bg: 'bg-white',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs ${typeConfig.bg} ${typeConfig.border} animate-in slide-in-from-bottom-2 duration-150`}
            >
              {typeConfig.icon}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs sm:text-sm font-semibold text-[#0D1A26]">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-[#5D6B78] mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a dummy fallback so it can be called safely even if not wrapped
    return {
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
};
