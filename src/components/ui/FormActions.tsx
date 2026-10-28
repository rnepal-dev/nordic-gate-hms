import React from 'react';
import { Button } from './Button';

export interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  leftSlot?: React.ReactNode;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  submitDisabled = false,
  leftSlot,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-5 border-t border-[#EDE7DC] mt-6">
      <div>{leftSlot}</div>
      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={submitDisabled || isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
