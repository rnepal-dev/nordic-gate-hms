import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnBackdropClick={!isLoading}
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isDestructive
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-amber-50 text-[#BF8641] border border-amber-200'
          }`}
        >
          {isDestructive ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-[#0D1A26] mb-1.5">{title}</h4>
          <div className="text-sm text-[#5D6B78] leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </Modal>
  );
};
