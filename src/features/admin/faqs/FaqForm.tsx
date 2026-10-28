import React, { useState, useEffect } from 'react';
import {
  AdminFaq,
  ApiFaqPayload,
  FAQ_CATEGORIES,
  toApiFaqPayload,
  validateFaqFields,
} from './faqTypes';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { FormActions } from '../../../components/ui/FormActions';
import { Tag, Hash, Calendar } from 'lucide-react';

export interface FaqFormProps {
  initialData?: AdminFaq | null;
  onSubmit: (payload: ApiFaqPayload & { id?: number }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FaqForm: React.FC<FaqFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [category, setCategory] = useState(initialData?.category || 'general');
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData?.display_order ?? 1
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
      setCategory(initialData.category || 'general');
      setDisplayOrder(initialData.display_order ?? 1);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('general');
      setDisplayOrder(1);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateFaqFields({
      question,
      answer,
      category,
      display_order: displayOrder,
    });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const cleanPayload = toApiFaqPayload({
      question,
      answer,
      category,
      display_order: displayOrder,
    });

    onSubmit({
      ...cleanPayload,
      ...(initialData?.id ? { id: initialData.id } : {}),
    });
  };

  const questionCharCount = question.length;
  const isQuestionOverLimit = questionCharCount > 300;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Read-Only Server Identifiers Header (when editing) */}
      {initialData?.id && (
        <div className="p-3 bg-[#F8F5EF] border border-[#D3C8B9] rounded-xl flex items-center justify-between text-xs text-[#5D6B78]">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#BF8641]" />
            <span className="font-semibold text-[#0D1A26]">
              FAQ ID #{initialData.id}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EDE7DC] text-[#25303A] uppercase tracking-wider">
              Read-Only
            </span>
          </div>
          {initialData.updated_at && (
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last updated: {initialData.updated_at}</span>
            </div>
          )}
        </div>
      )}

      {/* Question Field with strict 300 char counter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#0D1A26] uppercase tracking-wider">
            Question <span className="text-rose-500">*</span>
          </label>
          <span
            className={`text-[11px] font-mono ${
              isQuestionOverLimit
                ? 'text-rose-600 font-bold'
                : questionCharCount > 250
                ? 'text-amber-600'
                : 'text-stone-400'
            }`}
          >
            {questionCharCount}/300 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
          }}
          placeholder="e.g. What are the check-in and check-out times at Hotel Nordic Gate?"
          maxLength={350} // slight buffer to show error message if user pastes >300
          className={`w-full p-3 text-xs sm:text-sm bg-white border rounded-xl text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641] transition-colors resize-y ${
            errors.question || isQuestionOverLimit
              ? 'border-rose-400 ring-1 ring-rose-300'
              : 'border-[#D3C8B9]'
          }`}
        />
        {errors.question ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.question}</p>
        ) : (
          <p className="mt-1 text-[11px] text-[#5D6B78]">
            Clear, guest-friendly question (maximum 300 characters).
          </p>
        )}
      </div>

      {/* Answer Field */}
      <div>
        <label className="block text-xs font-semibold text-[#0D1A26] uppercase tracking-wider mb-1.5">
          Answer <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (errors.answer) setErrors((prev) => ({ ...prev, answer: '' }));
          }}
          placeholder="e.g. Check-in is from 15:00 to 23:00, and check-out is from 06:00 to 11:00..."
          className={`w-full p-3 text-xs sm:text-sm bg-white border rounded-xl text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641] transition-colors resize-y ${
            errors.answer
              ? 'border-rose-400 ring-1 ring-rose-300'
              : 'border-[#D3C8B9]'
          }`}
        />
        {errors.answer ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.answer}</p>
        ) : (
          <p className="mt-1 text-[11px] text-[#5D6B78]">
            Comprehensive response published to the guest portal and website FAQ section.
          </p>
        )}
      </div>

      {/* Category & Display Order Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              ...FAQ_CATEGORIES.map((c) => ({
                value: c.value,
                label: c.label,
              })),
            ]}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
          )}
        </div>

        <div>
          <TextField
            label="Display Order"
            type="number"
            min={0}
            max={2147483647}
            value={displayOrder.toString()}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setDisplayOrder(isNaN(val) ? 0 : val);
            }}
            error={errors.display_order}
            helperText="0 to 2,147,483,647 (lower numbers display first)"
          />
        </div>
      </div>

      {/* Reusable FormActions */}
      <FormActions
        onCancel={onCancel}
        isSubmitting={isLoading}
        submitLabel={initialData?.id ? 'Save FAQ' : 'Create FAQ'}
        submitDisabled={isQuestionOverLimit}
      />
    </form>
  );
};
