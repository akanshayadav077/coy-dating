import { test } from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config/index.js';
import { likerId, nonLikerId, startServer, withApi } from './helpers.js';

test('feed returns 30 profiles and never includes the current user', () =>
  withApi(async (api) => {
    const { status, body } = await api.get('/feed?limit=50');
    assert.equal(status, 200);
    assert.equal(body.profiles.length, 30);
    assert.equal(body.remaining, 0);
    assert.ok(body.profiles.every((profile) => profile.id !== config.currentUserId));
  }));

test('feed respects limit and reports remaining profiles', () =>
  withApi(async (api) => {
    const { body } = await api.get('/feed?limit=10');
    assert.equal(body.profiles.length, 10);
    assert.equal(body.remaining, 20);
  }));

test('feed rejects an invalid limit', () =>
  withApi(async (api) => {
    const { status, body } = await api.get('/feed?limit=0');
    assert.equal(status, 400);
    assert.equal(body.error.code, 'INVALID_LIMIT');
  }));

test('feed never exposes who liked the current user', () =>
  withApi(async (api) => {
    const { body } = await api.get('/feed?limit=50');
    const serialized = JSON.stringify(body);
    assert.ok(!serialized.includes('likesMe') && !serialized.includes('fromUserId'));
  }));

test('a swiped profile never reappears in the feed', () =>
  withApi(async (api) => {
    await api.post('/swipe', { targetId: nonLikerId, action: 'pass' });
    const { body } = await api.get('/feed?limit=50');
    assert.ok(body.profiles.every((profile) => profile.id !== nonLikerId));
  }));

test('liking someone who already liked you creates a match', () =>
  withApi(async (api) => {
    const { status, body } = await api.post('/swipe', { targetId: likerId, action: 'like' });
    assert.equal(status, 201);
    assert.equal(body.match.profile.id, likerId);

    const matches = await api.get('/matches');
    assert.equal(matches.body.total, 1);
    assert.equal(matches.body.matches[0].profile.id, likerId);
  }));

test('a one-sided like looks identical to a pass and creates no match', () =>
  withApi(async (api) => {
    const like = await api.post('/swipe', { targetId: nonLikerId, action: 'like' });
    assert.deepEqual(like.body, { match: null });

    const pass = await api.post('/swipe', { targetId: likerId, action: 'pass' });
    assert.deepEqual(pass.body, { match: null });

    assert.equal((await api.get('/matches')).body.total, 0);
  }));

test('swiping the same profile twice is rejected', () =>
  withApi(async (api) => {
    await api.post('/swipe', { targetId: likerId, action: 'like' });
    const { status, body } = await api.post('/swipe', { targetId: likerId, action: 'like' });
    assert.equal(status, 409);
    assert.equal(body.error.code, 'ALREADY_SWIPED');
    assert.equal((await api.get('/matches')).body.total, 1);
  }));

test('concurrent duplicate swipes create a single match', () =>
  withApi(async (api) => {
    const results = await Promise.all([
      api.post('/swipe', { targetId: likerId, action: 'like' }),
      api.post('/swipe', { targetId: likerId, action: 'like' }),
    ]);
    assert.deepEqual(results.map((result) => result.status).sort(), [201, 409]);
    assert.equal((await api.get('/matches')).body.total, 1);
  }));

test('swipe validates its input', () =>
  withApi(async (api) => {
    const cases = [
      [{ action: 'like' }, 400, 'INVALID_TARGET_ID'],
      [{ targetId: likerId, action: 'super' }, 400, 'INVALID_ACTION'],
      [{ targetId: config.currentUserId, action: 'like' }, 400, 'INVALID_TARGET'],
      [{ targetId: 'u_999', action: 'like' }, 404, 'PROFILE_NOT_FOUND'],
    ];
    for (const [payload, expectedStatus, expectedCode] of cases) {
      const { status, body } = await api.post('/swipe', payload);
      assert.equal(status, expectedStatus);
      assert.equal(body.error.code, expectedCode);
    }
  }));

test('unknown routes return a JSON 404', () =>
  withApi(async (api) => {
    const { status, body } = await api.get('/nope');
    assert.equal(status, 404);
    assert.equal(body.error.code, 'NOT_FOUND');
  }));

test('swipes and matches persist after the server restarts', () =>
  withApi(async (firstApi, dataFile) => {
    await firstApi.post('/swipe', { targetId: likerId, action: 'like' });

    const secondApi = await startServer(dataFile);
    try {
      assert.equal((await secondApi.get('/matches')).body.total, 1);
      const feed = await secondApi.get('/feed?limit=50');
      assert.equal(feed.body.profiles.length, 29);
    } finally {
      await secondApi.close();
    }
  }));
