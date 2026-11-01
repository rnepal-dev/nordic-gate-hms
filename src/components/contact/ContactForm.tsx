import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useCreateContactusMutation, type CreateContactI } from '@/redux/feature/others/contactUs/contactUsApi.ts';
import { useToast } from '../ui/Toast.tsx';
import { useHotel } from '../../context/HotelContext.tsx';
import { TextField } from '../ui/TextField.tsx';
import { Textarea } from '../ui/Textarea.tsx';
import { Button } from '../ui/Button.tsx';
import { isValidEmail } from '../../lib/contact-logic.ts';

interface ContactFormInputs {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const { lang } = useHotel();
  const { showToast } = useToast();
  const [createContactus, { isLoading }] = useCreateContactusMutation();

  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormInputs) => {
    setServerError(null);
    setSubmissionSuccess(false);

    // Build strictly typed and trimmed payload
    const payload: CreateContactI = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    const trimmedPhone = data.phone?.trim();
    if (trimmedPhone) {
      payload.phone = trimmedPhone;
    }

    try {
      await createContactus(payload).unwrap();

      // Show success state and reset form
      setSubmissionSuccess(true);
      reset();

      const successToastTitle = lang === 'sv' ? 'Meddelande skickat' : 'Message Sent';
      const successToastDesc = lang === 'sv'
        ? 'Ditt meddelande har tagits emot av Hotel Nordic Gate.'
        : 'Your message has been sent successfully to Hotel Nordic Gate.';

      showToast({
        title: successToastTitle,
        message: successToastDesc,
        type: 'success',
      });
    } catch (err: unknown) {
      console.error('Contact form submission error:', err);

      const errorMessage =
        lang === 'sv'
          ? 'Kunde inte skicka ditt meddelande just nu. Vänligen kontrollera dina uppgifter eller ring vår reception direkt.'
          : 'Unable to send your message right now. Please check your information or call our reception directly.';

      setServerError(errorMessage);

      showToast({
        title: lang === 'sv' ? 'Kunde inte skicka' : 'Submission Failed',
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const isPending = isLoading || isSubmitting;

  return (
    <div className="bg-white rounded-2xl p-7 sm:p-9 border border-[#EDE7DC] shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[#BF8641] text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'sv' ? 'Skicka Förfrågan' : 'Send An Inquiry'}</span>
        </div>
        <h3 className="font-brand-logo text-2xl text-[#02070D]">
          {lang === 'sv' ? 'Hur kan vi hjälpa dig?' : 'How May We Assist You?'}
        </h3>
        <p className="text-xs sm:text-sm text-[#5D6B78] mt-1.5 leading-relaxed">
          {lang === 'sv'
            ? 'Fyll i formuläret nedan så återkommer vårt team snarast möjligt till den angivna e-postadressen.'
            : 'Fill in the form below and our guest team will get back to you promptly at the provided email address.'}
        </p>
      </div>

      {/* Success Banner */}
      {submissionSuccess && (
        <div 
          role="status" 
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold text-emerald-950">
              {lang === 'sv' ? 'Tack för ditt meddelande!' : 'Thank you for reaching out!'}
            </p>
            <p className="text-emerald-800 leading-relaxed">
              {lang === 'sv'
                ? 'Ditt meddelande har skickats framgångsrikt. Tack för att du kontaktar Hotel Nordic Gate. Vårt team återkommer så snart som möjligt.'
                : 'Your message has been sent successfully. Thank you for contacting Hotel Nordic Gate. Our team will get back to you as soon as possible.'}
            </p>
            <button
              type="button"
              onClick={() => setSubmissionSuccess(false)}
              className="text-xs text-emerald-700 underline font-medium hover:text-emerald-900 mt-1 cursor-pointer"
            >
              {lang === 'sv' ? 'Skicka ett till meddelande' : 'Send another inquiry'}
            </button>
          </div>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold text-rose-950">
              {lang === 'sv' ? 'Ett fel uppstod' : 'Submission error'}
            </p>
            <p className="text-rose-800 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Full Name */}
          <TextField
            label={lang === 'sv' ? 'Fullständigt Namn *' : 'Full Name *'}
            placeholder={lang === 'sv' ? 't.ex. Astrid Lindgren' : 'e.g. Astrid Lindgren'}
            disabled={isPending}
            error={errors.name?.message}
            {...register('name', {
              required: lang === 'sv' ? 'Vänligen ange ditt fullständiga namn.' : 'Full name is required.',
              validate: (val) =>
                val.trim().length > 0 || (lang === 'sv' ? 'Namn kan inte bestå av enbart blanksteg.' : 'Name cannot be empty or whitespace only.'),
            })}
          />

          {/* Email Address */}
          <TextField
            type="email"
            label={lang === 'sv' ? 'E-postadress *' : 'Email Address *'}
            placeholder={lang === 'sv' ? 'namn@exempel.se' : 'name@example.com'}
            disabled={isPending}
            error={errors.email?.message}
            {...register('email', {
              required: lang === 'sv' ? 'Vänligen ange din e-postadress.' : 'Email address is required.',
              validate: (val) =>
                isValidEmail(val) || (lang === 'sv' ? 'Vänligen ange en giltig e-postadress.' : 'Please enter a valid email address.'),
            })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Phone Number (Optional) */}
          <TextField
            type="tel"
            label={lang === 'sv' ? 'Telefonnummer (valfritt)' : 'Phone Number (optional)'}
            placeholder={lang === 'sv' ? 't.ex. +46 70 123 45 67' : 'e.g. +46 70 123 45 67'}
            helperText={lang === 'sv' ? 'Underlättar snabb kontakt vid akuta bokningsfrågor' : 'Helps us reach you quickly for urgent stay requests'}
            disabled={isPending}
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Subject */}
          <TextField
            label={lang === 'sv' ? 'Ämne *' : 'Subject *'}
            placeholder={lang === 'sv' ? 't.ex. Rumsbokning eller frukostfråga' : 'e.g. Room reservation or dietary request'}
            disabled={isPending}
            error={errors.subject?.message}
            {...register('subject', {
              required: lang === 'sv' ? 'Vänligen ange ett ämne.' : 'Subject is required.',
              validate: (val) =>
                val.trim().length > 0 || (lang === 'sv' ? 'Ämne kan inte bestå av enbart blanksteg.' : 'Subject cannot be empty or whitespace only.'),
            })}
          />
        </div>

        {/* Message */}
        <Textarea
          rows={5}
          label={lang === 'sv' ? 'Ditt Meddelande *' : 'Your Message *'}
          placeholder={
            lang === 'sv'
              ? 'Beskriv din förfrågan, planerade ankomstdatum, antal gäster eller särskilda önskemål...'
              : 'Describe your inquiry, anticipated travel dates, party size, or specific requirements...'
          }
          helperText={lang === 'sv' ? 'Dina personuppgifter behandlas tryggt enligt hotellets integritetspolicy.' : 'Your details are handled strictly in accordance with our hotel privacy policy.'}
          disabled={isPending}
          error={errors.message?.message}
          {...register('message', {
            required: lang === 'sv' ? 'Vänligen ange ditt meddelande.' : 'Message is required.',
            validate: (val) =>
              val.trim().length > 0 || (lang === 'sv' ? 'Meddelandet kan inte bestå av enbart blanksteg.' : 'Message cannot be empty or whitespace only.'),
          })}
        />

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <p className="text-[11px] text-stone-500 order-2 sm:order-1">
            * {lang === 'sv' ? 'Obligatoriska fält för behandling av ditt ärende' : 'Required fields for inquiry processing'}
          </p>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            disabled={isPending}
            className="order-1 sm:order-2 w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>
              {isPending
                ? (lang === 'sv' ? 'Skickar meddelande...' : 'Sending Message...')
                : (lang === 'sv' ? 'Skicka Meddelande' : 'Send Message')}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};
