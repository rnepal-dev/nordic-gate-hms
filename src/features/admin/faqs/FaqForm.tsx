import React, { useState, useEffect } from 'react';
import { AdminFaq, FaqCategory, FAQ_CATEGORIES } from './faqTypes';
import { StatusType } from '../../../components/ui/StatusBadge';
import { TextField } from '../../../components/ui/TextField';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { LocaleTabs, AdminLocale } from '../../../components/admin/LocaleTabs';

export interface FaqFormProps {
  initialData?: AdminFaq | null;
  onSubmit: (data: Omit<AdminFaq, 'id' | 'updatedAt'> & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FaqForm: React.FC<FaqFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [activeLocale, setActiveLocale] = useState<AdminLocale>('sv');

  const [category, setCategory] = useState<FaqCategory>(
    initialData?.category || 'general'
  );
  const [questionSv, setQuestionSv] = useState(initialData?.questionSv || '');
  const [questionEn, setQuestionEn] = useState(initialData?.questionEn || '');
  const [answerSv, setAnswerSv] = useState(initialData?.answerSv || '');
  const [answerEn, setAnswerEn] = useState(initialData?.answerEn || '');
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData?.displayOrder ?? 1
  );
  const [status, setStatus] = useState<StatusType>(initialData?.status || 'published');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setQuestionSv(initialData.questionSv);
      setQuestionEn(initialData.questionEn);
      setAnswerSv(initialData.answerSv);
      setAnswerEn(initialData.answerEn);
      setDisplayOrder(initialData.displayOrder);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!questionSv.trim()) {
      newErrors.questionSv = 'Swedish question is required';
    }
    if (!answerSv.trim()) {
      newErrors.answerSv = 'Swedish answer is required';
    }
    if (!questionEn.trim()) {
      newErrors.questionEn = 'English question is required';
    }
    if (!answerEn.trim()) {
      newErrors.answerEn = 'English answer is required';
    }
    if (isNaN(displayOrder) || displayOrder < 1) {
      newErrors.displayOrder = 'Display order must be 1 or higher';
    }

    setErrors(newErrors);

    // If active locale has no errors but the other does, switch to that locale to help the user
    if (activeLocale === 'sv' && (newErrors.questionEn || newErrors.answerEn) && !newErrors.questionSv && !newErrors.answerSv) {
      setActiveLocale('en');
    } else if (activeLocale === 'en' && (newErrors.questionSv || newErrors.answerSv) && !newErrors.questionEn && !newErrors.answerEn) {
      setActiveLocale('sv');
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: initialData?.id,
      category,
      questionSv: questionSv.trim(),
      questionEn: questionEn.trim(),
      answerSv: answerSv.trim(),
      answerEn: answerEn.trim(),
      displayOrder: Number(displayOrder),
      status,
      author: initialData?.author || 'Hotel Administrator',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Switcher for Bilingual Fields */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE7DC]">
        <div>
          <span className="text-xs font-bold text-[#0D1A26] block">
            Content Language
          </span>
          <span className="text-[11px] text-[#5D6B78]">
            Edit Swedish (primary) and English website copy
          </span>
        </div>
        <LocaleTabs currentLocale={activeLocale} onChange={setActiveLocale} />
      </div>

      {/* Multilingual Question & Answer inputs */}
      <div className="space-y-4">
        {activeLocale === 'sv' ? (
          <>
            <TextField
              label="Fråga (Svenska)"
              required
              value={questionSv}
              onChange={(e) => setQuestionSv(e.target.value)}
              placeholder="t.ex. Vilka tider gäller för incheckning?"
              error={errors.questionSv}
              helperText="Frågan som visas för svenska besökare"
            />
            <Textarea
              label="Svar (Svenska)"
              required
              rows={4}
              value={answerSv}
              onChange={(e) => setAnswerSv(e.target.value)}
              placeholder="Beskriv svaret tydligt och elegant..."
              error={errors.answerSv}
              helperText="Fullständigt svar i FAQ-sektionen"
            />
          </>
        ) : (
          <>
            <TextField
              label="Question (English)"
              required
              value={questionEn}
              onChange={(e) => setQuestionEn(e.target.value)}
              placeholder="e.g. What are the check-in and check-out times?"
              error={errors.questionEn}
              helperText="The question displayed for international visitors"
            />
            <Textarea
              label="Answer (English)"
              required
              rows={4}
              value={answerEn}
              onChange={(e) => setAnswerEn(e.target.value)}
              placeholder="Provide a clear, hospitality-focused response..."
              error={errors.answerEn}
              helperText="Full answer in the website FAQ section"
            />
          </>
        )}
      </div>

      {/* Meta & Categorization section */}
      <div className="pt-4 border-t border-[#EDE7DC] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Settings & Taxonomy
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as FaqCategory)}
            options={FAQ_CATEGORIES.map((cat) => ({
              value: cat.value,
              label: `${cat.labelEn} (${cat.labelSv})`,
            }))}
          />

          <Select
            label="Publication Status"
            required
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusType)}
            options={[
              { value: 'published', label: 'Published (Live)' },
              { value: 'draft', label: 'Draft (Hidden)' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        <div className="max-w-xs">
          <TextField
            label="Display Sort Order"
            type="number"
            min={1}
            value={displayOrder.toString()}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
            error={errors.displayOrder}
            helperText="Lower numbers appear first on the FAQ page"
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#EDE7DC]">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create FAQ'}
        </Button>
      </div>
    </form>
  );
};
