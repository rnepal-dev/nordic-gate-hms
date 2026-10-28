import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ADMIN_FAQS } from '../../../data/adminMockData.ts';
import {
  validateFaqFields,
  toApiFaqPayload,
} from './faqTypes.ts';

test('INITIAL_ADMIN_FAQS has valid integer IDs and conforming schema', () => {
  assert.ok(INITIAL_ADMIN_FAQS.length >= 8, 'Should have at least 8 initial FAQs');

  for (const faq of INITIAL_ADMIN_FAQS) {
    assert.strictEqual(typeof faq.id, 'number', `FAQ ID should be integer: ${faq.id}`);
    assert.ok(faq.question.length > 5, `Question should be non-empty: ${faq.id}`);
    assert.ok(faq.answer.length > 10, `Answer should be non-empty: ${faq.id}`);
    assert.ok(faq.question.length <= 300, `Question must be <= 300 chars: ${faq.id}`);
    assert.strictEqual(typeof faq.display_order, 'number');
    assert.ok(faq.display_order >= 0 && faq.display_order <= 2147483647, 'display_order within integer bounds');
  }
});

test('validateFaqFields enforces 300 max chars on question and required answer', () => {
  const emptyErrors = validateFaqFields({
    question: '',
    answer: '',
    display_order: 1,
  });
  assert.ok(emptyErrors.question, 'Should reject empty question');
  assert.ok(emptyErrors.answer, 'Should reject empty answer');

  const tooLongQuestion = 'Q'.repeat(301);
  const lengthErrors = validateFaqFields({
    question: tooLongQuestion,
    answer: 'Valid answer',
    display_order: 1,
  });
  assert.ok(lengthErrors.question, 'Should reject question exceeding 300 characters');

  const validErrors = validateFaqFields({
    question: 'Are there irons in the room?',
    answer: 'Yes, irons are available upon request.',
    category: 'general',
    display_order: 5,
  });
  assert.strictEqual(Object.keys(validErrors).length, 0, 'Should accept valid question and answer');
});

test('validateFaqFields enforces integer display_order range (0 to 2147483647)', () => {
  const negativeErrors = validateFaqFields({
    question: 'Test question?',
    answer: 'Test answer',
    display_order: -1,
  });
  assert.ok(negativeErrors.display_order, 'Should reject negative display_order');

  const tooBigErrors = validateFaqFields({
    question: 'Test question?',
    answer: 'Test answer',
    display_order: 2147483648,
  });
  assert.ok(tooBigErrors.display_order, 'Should reject display_order > 2147483647');

  const decimalErrors = validateFaqFields({
    question: 'Test question?',
    answer: 'Test answer',
    display_order: 2.5,
  });
  assert.ok(decimalErrors.display_order, 'Should reject non-integer display_order');
});

test('toApiFaqPayload outputs clean schema object without unsupported properties', () => {
  const rawInput = {
    question: '  Where is the indoor pool located?  ',
    answer: '  On the ground floor relax wing.  ',
    category: '  wellness  ',
    display_order: 3,
    status: 'published', // unsupported API field
    questionSv: 'Var ligger poolen?', // unsupported API field
  };

  const payload = toApiFaqPayload(rawInput as any);

  assert.strictEqual(payload.question, 'Where is the indoor pool located?');
  assert.strictEqual(payload.answer, 'On the ground floor relax wing.');
  assert.strictEqual(payload.category, 'wellness');
  assert.strictEqual(payload.display_order, 3);
  assert.strictEqual((payload as any).status, undefined, 'Must not send status');
  assert.strictEqual((payload as any).questionSv, undefined, 'Must not send questionSv');
});
