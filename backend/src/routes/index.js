import { Router } from 'express';
import {
  validateAccountUpdate,
  validateFeedQuery,
  validateLogin,
  validateMessage,
  validateSwipe,
} from '../middleware/validate.js';

export function createRoutes({ feed, swipe, matches, me, account, demo }) {
  const router = Router();
  router.get('/feed', validateFeedQuery, feed.getFeed);
  router.post('/swipe', validateSwipe, swipe.swipe);
  router.get('/matches', matches.getMatches);
  router.get('/matches/:matchId/messages', matches.getMessages);
  router.post('/matches/:matchId/messages', validateMessage, matches.sendMessage);
  router.get('/me', me.getMe);
  router.post('/account/login', validateLogin, account.login);
  router.get('/account', account.getAccount);
  router.patch('/account', validateAccountUpdate, account.update);
  router.delete('/account', account.remove);
  router.post('/demo/reset', demo.reset);
  return router;
}
