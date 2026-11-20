import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/AppError.js';
import { toMatchView } from '../utils/toMatchView.js';
import * as usersRepository from '../repositories/usersRepository.js';
import * as matchesRepository from '../repositories/matchesRepository.js';
import * as messagesRepository from '../repositories/messagesRepository.js';

const AUTO_REPLIES = [
  'Hey! Glad we matched — how is your week going?',
  'Haha okay, that actually made me smile. What are you up to today?',
  'So glad we both swiped right! Are you around campus this week?',
];

function getMatchOrThrow(db, currentUserId, matchId) {
  const match = matchesRepository.findForUser(db, currentUserId).find((item) => item.id === matchId);
  if (!match) {
    throw new AppError(404, 'MATCH_NOT_FOUND', 'That match does not exist.');
  }
  return match;
}

export function createMatchesService({ store, currentUserId }) {
  return {
    async getMatches() {
      const db = await store.read();
      const matches = matchesRepository
        .findForUser(db, currentUserId)
        .map((match) => ({
          ...toMatchView(match, usersRepository.findById(db, match.matchedUserId)),
          lastMessage: messagesRepository.findLatestByMatchId(db, match.id),
        }))
        .sort((a, b) => {
          const ta = a.lastMessage?.createdAt || a.createdAt;
          const tb = b.lastMessage?.createdAt || b.createdAt;
          return tb.localeCompare(ta);
        });
      return { matches, total: matches.length };
    },

    async getMessages(matchId) {
      const db = await store.read();
      const match = getMatchOrThrow(db, currentUserId, matchId);
      const profile = usersRepository.findById(db, match.matchedUserId);
      const messages = messagesRepository
        .findByMatchId(db, matchId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return { match: toMatchView(match, profile), messages };
    },

    sendMessage(matchId, text) {
      return store.transaction((db) => {
        const match = getMatchOrThrow(db, currentUserId, matchId);
        const existing = messagesRepository.findByMatchId(db, matchId);
        const now = Date.now();

        const userMessage = messagesRepository.add(db, {
          id: `msg_${randomUUID()}`,
          matchId,
          senderId: currentUserId,
          text,
          createdAt: new Date(now).toISOString(),
        });

        let autoReply = null;
        if (existing.length === 0) {
          const replyText = AUTO_REPLIES[match.matchedUserId.charCodeAt(match.matchedUserId.length - 1) % AUTO_REPLIES.length];
          autoReply = messagesRepository.add(db, {
            id: `msg_${randomUUID()}`,
            matchId,
            senderId: match.matchedUserId,
            text: replyText,
            createdAt: new Date(now + 1).toISOString(),
          });
        }

        return { message: userMessage, autoReply };
      });
    },
  };
}
