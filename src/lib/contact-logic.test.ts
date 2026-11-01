import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isNonEmptyString,
  validateContactForm,
  prepareContactPayload,
  type ContactFormValues,
} from './contact-logic.ts';

test('isValidEmail accepts valid formats and rejects invalid ones', () => {
  assert.equal(isValidEmail('guest@example.com'), true);
  assert.equal(isValidEmail('astrid.lindgren@nordicgate.se'), true);
  assert.equal(isValidEmail('user+tag@domain.co.uk'), true);

  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('   '), false);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('missing@tld'), false);
  assert.equal(isValidEmail('@missinguser.com'), false);
  assert.equal(isValidEmail('spaces in@email.com'), false);
});

test('isNonEmptyString checks for non-whitespace characters', () => {
  assert.equal(isNonEmptyString('Hello'), true);
  assert.equal(isNonEmptyString('  Spaced  '), true);
  assert.equal(isNonEmptyString(''), false);
  assert.equal(isNonEmptyString('   '), false);
  assert.equal(isNonEmptyString('\t\n'), false);
  assert.equal(isNonEmptyString(null), false);
  assert.equal(isNonEmptyString(undefined), false);
});

test('validateContactForm flags missing required fields and returns localized messages', () => {
  const emptyResultEn = validateContactForm({}, 'en');
  assert.ok(emptyResultEn.name, 'name error expected');
  assert.ok(emptyResultEn.email, 'email error expected');
  assert.ok(emptyResultEn.subject, 'subject error expected');
  assert.ok(emptyResultEn.message, 'message error expected');

  const emptyResultSv = validateContactForm({}, 'sv');
  assert.match(emptyResultSv.name, /fullständiga namn/);
  assert.match(emptyResultSv.email, /e-postadress/);

  const whitespaceOnly = validateContactForm({
    name: '   ',
    email: 'invalid-email',
    subject: '  \n',
    message: ' \t ',
  }, 'en');
  assert.ok(whitespaceOnly.name);
  assert.match(whitespaceOnly.email, /valid email/);
  assert.ok(whitespaceOnly.subject);
  assert.ok(whitespaceOnly.message);

  const valid = validateContactForm({
    name: 'Karin Larsson',
    email: 'karin@art.se',
    subject: 'Suite inquiry for weekend stay',
    message: 'Do you have baby cribs available in the Superior Room?',
  }, 'en');
  assert.equal(Object.keys(valid).length, 0);
});

test('prepareContactPayload trims all fields and includes optional phone only when non-empty', () => {
  const inputWithPhone: ContactFormValues = {
    name: '  Astrid Lindgren  ',
    email: '  Astrid@NordicGate.SE  ',
    phone: '  +46 31 750 19 00  ',
    subject: '  Harbour view rooms  ',
    message: '  We would like to book a table at the restaurant as well.  ',
  };

  const payloadWithPhone = prepareContactPayload(inputWithPhone);
  assert.equal(payloadWithPhone.name, 'Astrid Lindgren');
  assert.equal(payloadWithPhone.email, 'astrid@nordicgate.se');
  assert.equal(payloadWithPhone.phone, '+46 31 750 19 00');
  assert.equal(payloadWithPhone.subject, 'Harbour view rooms');
  assert.equal(payloadWithPhone.message, 'We would like to book a table at the restaurant as well.');

  const inputWithoutPhone: ContactFormValues = {
    name: 'Henrik Larsson',
    email: 'henrik@example.com',
    phone: '   ',
    subject: 'Conference facilities',
    message: 'Need meeting room for 12 persons.',
  };

  const payloadWithoutPhone = prepareContactPayload(inputWithoutPhone);
  assert.equal(payloadWithoutPhone.phone, undefined);
  assert.equal('phone' in payloadWithoutPhone, false);
});
