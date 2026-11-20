import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { config } from '../src/config/index.js';
import { likerId, withApi } from './helpers.js';

const readSeed = async () => JSON.parse(await readFile(config.seedFile, 'utf8'));
const PROFILE_FIELDS = ['age', 'bio', 'city', 'college', 'id', 'interests', 'name', 'photoUrl'];

test('seed has the logged-in user u_000 plus 30 discoverable profiles', async () => {
  const seed = await readSeed();
  const ids = seed.users.map((user) => user.id);
  assert.equal(config.currentUserId, 'u_000');
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes('u_000'));
  assert.equal(ids.filter((id) => id !== 'u_000').length, 30);
});

test('every seeded profile has complete data and a randomuser.me photo', async () => {
  const seed = await readSeed();
  for (const user of seed.users) {
    assert.deepEqual(Object.keys(user).sort(), PROFILE_FIELDS);
    assert.match(user.photoUrl, /^https:\/\/randomuser\.me\/api\/portraits\/(men|women)\/\d{1,2}\.jpg$/);
    assert.ok(user.interests.length > 0);
  }
  const photos = seed.users.map((user) => user.photoUrl);
  assert.equal(new Set(photos).size, photos.length);
});

test('seeded likes are incoming only and point at real users', async () => {
  const seed = await readSeed();
  const ids = new Set(seed.users.map((user) => user.id));
  assert.equal(seed.likes.length, 8);
  for (const like of seed.likes) {
    assert.equal(like.toUserId, 'u_000');
    assert.ok(ids.has(like.fromUserId));
  }
  assert.deepEqual(seed.swipes, []);
  assert.deepEqual(seed.matches, []);
});

test('feed profiles carry only public fields and never expose likes', () =>
  withApi(async (api) => {
    const { body } = await api.get('/feed?limit=50');
    assert.deepEqual(Object.keys(body).sort(), ['profiles', 'remaining']);
    for (const profile of body.profiles) assert.deepEqual(Object.keys(profile).sort(), PROFILE_FIELDS);
    assert.ok(!JSON.stringify(body).includes('fromUserId'));
  }));

test('/me is the user u_000', () =>
  withApi(async (api) => {
    const { body } = await api.get('/me');
    assert.equal(body.id, 'u_000');
  }));

test('liking each of the 8 seeded likers matches, and the 22 others never do', () =>
  withApi(async (api) => {
    const seed = await readSeed();
    const likers = new Set(seed.likes.map((like) => like.fromUserId));
    const others = seed.users.filter((user) => user.id !== 'u_000');

    for (const { id } of others) {
      const { body } = await api.post('/swipe', { targetId: id, action: 'like' });
      assert.equal(body.match === null, !likers.has(id), `${id}`);
    }
    const matches = (await api.get('/matches')).body;
    assert.equal(matches.total, 8);
    assert.deepEqual(matches.matches.map((m) => m.profile.id).sort(), [...likers].sort());
  }));

test('swipes survive a restart and the seed file is never modified', () =>
  withApi(async (api, dataFile) => {
    const before = await readFile(config.seedFile, 'utf8');
    await api.post('/swipe', { targetId: likerId, action: 'like' });
    assert.equal(await readFile(config.seedFile, 'utf8'), before);

    const { startServer } = await import('./helpers.js');
    const restarted = await startServer(dataFile);
    try {
      assert.equal((await restarted.get('/matches')).body.total, 1);
      assert.equal((await restarted.post('/swipe', { targetId: likerId, action: 'like' })).status, 409);
    } finally {
      await restarted.close();
    }
  }));
