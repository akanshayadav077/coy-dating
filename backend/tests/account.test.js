import { test } from 'node:test';
import assert from 'node:assert/strict';
import { likerId, startServer, withApi } from './helpers.js';

const PHONE = '+91 9876543210';

test('a fresh account is empty and has alerts on', () =>
  withApi(async (api) => {
    const { status, body } = await api.get('/account');
    assert.equal(status, 200);
    assert.deepEqual(body, { phone: null, firstName: null, email: null, alertsEnabled: true, referralCode: null });
  }));

test('login creates an account with a referral code and is repeatable', () =>
  withApi(async (api) => {
    const first = await api.post('/account/login', { phone: PHONE });
    assert.equal(first.body.phone, PHONE);
    assert.match(first.body.referralCode, /^[A-Z2-9]{6}$/);

    await api.patch('/account', { firstName: 'Sam' });
    const again = await api.post('/account/login', { phone: PHONE });
    assert.equal(again.body.referralCode, first.body.referralCode);
    assert.equal(again.body.firstName, 'Sam');
  }));

test('logging in with a different number starts a fresh account', () =>
  withApi(async (api) => {
    await api.post('/account/login', { phone: PHONE });
    await api.patch('/account', { firstName: 'Sam' });
    const { body } = await api.post('/account/login', { phone: '+91 9123456780' });
    assert.equal(body.firstName, null);
  }));

test('login rejects a malformed phone number', () =>
  withApi(async (api) => {
    const { status, body } = await api.post('/account/login', { phone: '12345' });
    assert.equal(status, 400);
    assert.equal(body.error.code, 'INVALID_PHONE');
  }));

test('account updates are validated, trimmed and persisted', () =>
  withApi(async (api, dataFile) => {
    await api.post('/account/login', { phone: PHONE });
    const { status, body } = await api.patch('/account', {
      firstName: '  Aanya ',
      email: ' Aanya@Example.com ',
      alertsEnabled: false,
    });
    assert.equal(status, 200);
    assert.equal(body.firstName, 'Aanya');
    assert.equal(body.email, 'aanya@example.com');
    assert.equal(body.alertsEnabled, false);

    const restarted = await startServer(dataFile);
    try {
      assert.deepEqual((await restarted.get('/account')).body, body);
    } finally {
      await restarted.close();
    }
  }));

test('account updates reject invalid input', () =>
  withApi(async (api) => {
    await api.post('/account/login', { phone: PHONE });
    const cases = [
      [{}, 'INVALID_ACCOUNT_UPDATE'],
      [{ phone: '+1 5555555' }, 'INVALID_ACCOUNT_UPDATE'],
      [{ firstName: '' }, 'INVALID_FIRST_NAME'],
      [{ firstName: 'R2D2' }, 'INVALID_FIRST_NAME'],
      [{ email: 'not-an-email' }, 'INVALID_EMAIL'],
      [{ alertsEnabled: 'yes' }, 'INVALID_ALERTS'],
    ];
    for (const [payload, expectedCode] of cases) {
      const { status, body } = await api.patch('/account', payload);
      assert.equal(status, 400);
      assert.equal(body.error.code, expectedCode);
    }
  }));

test('updating before login is rejected', () =>
  withApi(async (api) => {
    const { status, body } = await api.patch('/account', { firstName: 'Sam' });
    assert.equal(status, 401);
    assert.equal(body.error.code, 'NOT_LOGGED_IN');
  }));

test('/me shows the onboarding first name', () =>
  withApi(async (api) => {
    await api.post('/account/login', { phone: PHONE });
    await api.patch('/account', { firstName: 'Aanya' });
    assert.equal((await api.get('/me')).body.name, 'Aanya');
  }));

test('deleting the account resets only the demo user data', () =>
  withApi(async (api) => {
    await api.post('/account/login', { phone: PHONE });
    await api.patch('/account', { firstName: 'Sam', email: 'sam@example.com' });
    await api.post('/swipe', { targetId: likerId, action: 'like' });

    const removal = await api.delete('/account');
    assert.equal(removal.status, 204);

    assert.equal((await api.get('/account')).body.phone, null);
    assert.equal((await api.get('/matches')).body.total, 0);
    assert.equal((await api.get('/feed?limit=50')).body.profiles.length, 30);

    const again = await api.post('/swipe', { targetId: likerId, action: 'like' });
    assert.equal(again.body.match.profile.id, likerId);
  }));

test('first names in other scripts are accepted', () =>
  withApi(async (api) => {
    await api.post('/account/login', { phone: PHONE });
    const { status, body } = await api.patch('/account', { firstName: 'आर्यन' });
    assert.equal(status, 200);
    assert.equal(body.firstName, 'आर्यन');
  }));
