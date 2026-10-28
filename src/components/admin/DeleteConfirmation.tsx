import React from 'react';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'item',
  isLoading = false,
}) => {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}?`}
      message={
        <span>
          Are you sure you want to permanently delete{' '}
          <strong className="text-[#0D1A26]">"{itemName}"</strong>? This action
          cannot be undone.
        </span>
      }
      confirmLabel={`Delete ${itemType}`}
      cancelLabel="Keep item"
      isDestructive={true}
      isLoading={isLoading}
    />
  );
};
