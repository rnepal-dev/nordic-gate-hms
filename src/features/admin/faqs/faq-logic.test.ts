import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_ADMIN_FAQS } from '../../../data/adminMockData.ts';
import { AdminFaq } from './faqTypes.ts';

test('INITIAL_ADMIN_FAQS has valid bilingual records', () => {
  assert.ok(INITIAL_ADMIN_FAQS.length >= 8, 'Should have at least 8 initial FAQs');
  
  for (const faq of INITIAL_ADMIN_FAQS) {
    assert.ok(faq.id.startsWith('faq-'), `FAQ ID should be formatted: ${faq.id}`);
    assert.ok(faq.questionEn.length > 5, `English question should be non-empty: ${faq.id}`);
    assert.ok(faq.questionSv.length > 5, `Swedish question should be non-empty: ${faq.id}`);
    assert.ok(faq.answerEn.length > 10, `English answer should be non-empty: ${faq.id}`);
    assert.ok(faq.answerSv.length > 10, `Swedish answer should be non-empty: ${faq.id}`);
    assert.ok(faq.displayOrder >= 1, `Display order should be positive: ${faq.id}`);
    assert.ok(['published', 'draft', 'archived'].includes(faq.status), `Status must be valid: ${faq.status}`);
  }
});

test('Search filters FAQs across English and Swedish fields', () => {
  const query = 'kontantfritt'; // Cash-free in Swedish
  const matchedSv = INITIAL_ADMIN_FAQS.filter(
    (f) => f.questionSv.toLowerCase().includes(query) || f.answerSv.toLowerCase().includes(query)
  );
  assert.ok(matchedSv.length > 0, 'Should find cash-free FAQ with Swedish query');

  const queryEn = 'parking';
  const matchedEn = INITIAL_ADMIN_FAQS.filter(
    (f) => f.questionEn.toLowerCase().includes(queryEn) || f.answerEn.toLowerCase().includes(queryEn)
  );
  assert.ok(matchedEn.length > 0, 'Should find parking FAQ with English query');
});

test('Category and status filtering returns correct subsets', () => {
  const diningFaqs = INITIAL_ADMIN_FAQS.filter((f) => f.category === 'dining');
  assert.ok(diningFaqs.length >= 1, 'Should have at least 1 dining FAQ');

  const publishedFaqs = INITIAL_ADMIN_FAQS.filter((f) => f.status === 'published');
  assert.ok(publishedFaqs.length > 0, 'Should have published FAQs');

  const draftFaqs = INITIAL_ADMIN_FAQS.filter((f) => f.status === 'draft');
  assert.ok(draftFaqs.length > 0, 'Should have draft FAQs for testing drafts');
});

test('Display order sorting maintains ordered sequence', () => {
  const sorted = [...INITIAL_ADMIN_FAQS].sort((a, b) => a.displayOrder - b.displayOrder);
  for (let i = 0; i < sorted.length - 1; i++) {
    assert.ok(sorted[i].displayOrder <= sorted[i + 1].displayOrder, 'FAQs must be sorted ascending by displayOrder');
  }
});
