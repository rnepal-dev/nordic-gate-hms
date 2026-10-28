import React, { useState, useEffect } from 'react';
import {
  ApiFacilityItem,
  ApiFacilityPayload,
  FacilityCategoryEnum,
  FACILITY_CATEGORIES,
  generateFacilitySlug,
  getCategoryDisplay,
  validateFacilityFields,
} from './facilityTypes';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { IconPicker } from '../../../components/ui/IconPicker';
import { BooleanField } from '../../../components/ui/BooleanField';
import { FormActions } from '../../../components/ui/FormActions';
import { Hash, Sparkles, Layers } from 'lucide-react';

export interface FacilityFormProps {
  initialData?: ApiFacilityItem | null;
  onSubmit: (payload: ApiFacilityPayload & { id?: number; slug?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FacilityForm: React.FC<FacilityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<FacilityCategoryEnum>(
    initialData?.category || 'wellness'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [icon, setIcon] = useState(initialData?.icon || 'waves');
  const [isAvailable, setIsAvailable] = useState<boolean>(
    initialData?.is_available ?? true
  );
  const [isFree, setIsFree] = useState<boolean>(initialData?.is_free ?? true);
  const [requiresReservation, setRequiresReservation] = useState<boolean>(
    initialData?.requires_reservation ?? false
  );
  const [additionalInformation, setAdditionalInformation] = useState(
    initialData?.additional_information || ''
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData?.display_order ?? 1
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setIcon(initialData.icon);
      setIsAvailable(initialData.is_available);
      setIsFree(initialData.is_free);
      setRequiresReservation(initialData.requires_reservation);
      setAdditionalInformation(initialData.additional_information || '');
      setDisplayOrder(initialData.display_order);
    } else {
      setName('');
      setCategory('wellness');
      setDescription('');
      setIcon('waves');
      setIsAvailable(true);
      setIsFree(true);
      setRequiresReservation(false);
      setAdditionalInformation('');
      setDisplayOrder(1);
    }
  }, [initialData]);

  const computedSlug = initialData?.slug || generateFacilitySlug(name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ApiFacilityPayload = {
      name: name.trim(),
      category,
      description: description.trim(),
      icon,
      is_available: isAvailable,
      is_free: isFree,
      requires_reservation: requiresReservation,
      additional_information: additionalInformation.trim() || null,
      display_order: displayOrder,
    };

    const validationErrors = validateFacilityFields(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit({
      ...payload,
      ...(initialData?.id ? { id: initialData.id, slug: initialData.slug } : { slug: computedSlug }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Read-Only Server Metadata (when editing) */}
      {initialData?.id && (
        <div className="p-3.5 bg-[#F8F5EF] border border-[#D3C8B9] rounded-xl space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#BF8641]" />
              <span className="font-bold text-[#0D1A26]">
                Facility ID #{initialData.id}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EDE7DC] text-[#25303A] uppercase">
                Server-Generated
              </span>
            </div>
            <span className="font-mono text-stone-500 text-[11px]">
              slug: {initialData.slug}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#5D6B78] pt-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Display: <strong>{initialData.category_display}</strong></span>
          </div>
        </div>
      )}

      {/* Name and Slug */}
      <div className="space-y-4">
        <div>
          <TextField
            label="Facility Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="e.g. Heated Indoor Swimming Pool"
            error={errors.name}
            helperText="The public title displayed on the facilities list and website cards"
          />
          {name && (
            <p className="mt-1 text-[11px] font-mono text-[#5D6B78] pl-1">
              Generated Slug: <span className="text-[#BF8641]">{computedSlug}</span>
            </p>
          )}
        </div>

        <Select
          label="Category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value as FacilityCategoryEnum)}
          options={FACILITY_CATEGORIES.map((cat) => ({
            value: cat.value,
            label: cat.label,
          }))}
        />
      </div>

      {/* Description */}
      <div>
        <Textarea
          label="Description"
          required
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Describe the facility, temperature, equipment, or service details..."
          error={errors.description}
          helperText="Guest-facing overview for the website amenities guide"
        />
      </div>

      {/* Icon Picker Component */}
      <div>
        <IconPicker
          value={icon}
          onChange={(newIcon) => {
            setIcon(newIcon);
            if (errors.icon) setErrors((prev) => ({ ...prev, icon: '' }));
          }}
          error={errors.icon}
        />
      </div>

      {/* Boolean Toggles Grid */}
      <div className="space-y-3 pt-2 border-t border-[#EDE7DC]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Availability & Access Policies
        </h4>

        <div className="space-y-2.5">
          <BooleanField
            label="Operational Status"
            description="Whether the facility is currently open and operational for staying guests"
            checked={isAvailable}
            onChange={setIsAvailable}
            trueBadge="Available"
            falseBadge="Unavailable"
          />

          <BooleanField
            label="Complimentary Access"
            description="Is this facility free of charge for hotel guests, or does a fee apply?"
            checked={isFree}
            onChange={setIsFree}
            trueBadge="Complimentary"
            falseBadge="Paid Extra"
          />

          <BooleanField
            label="Reservation Required"
            description="Do guests need to book a time slot in advance at reception?"
            checked={requiresReservation}
            onChange={setRequiresReservation}
            trueBadge="Required"
            falseBadge="Walk-in Open"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <Textarea
          label="Additional Information (Optional)"
          rows={2}
          value={additionalInformation}
          onChange={(e) => setAdditionalInformation(e.target.value)}
          placeholder="e.g. Opening hours, age restrictions, or partner gym passes..."
          helperText="Operating hours, fees, or specific terms"
        />
      </div>

      {/* Display Order */}
      <div className="max-w-xs">
        <TextField
          label="Display Sort Order"
          type="number"
          min={0}
          value={displayOrder.toString()}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setDisplayOrder(isNaN(val) ? 0 : val);
          }}
          error={errors.display_order}
          helperText="Lower numbers appear first on the website (0 or higher)"
        />
      </div>

      {/* Reusable FormActions */}
      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData?.id ? 'Save Facility' : 'Create Facility'}
      />
    </form>
  );
};
