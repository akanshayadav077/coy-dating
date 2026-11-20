import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { isValidEmail, isValidFirstName, isValidPhone } from '../utils/validators.js';

const ACCOUNT_FIELDS = ['firstName', 'email', 'alertsEnabled'];

export function validateFeedQuery(req, res, next) {
  const { defaultLimit, maxLimit } = config.feed;
  const limit = req.query.limit === undefined ? defaultLimit : Number(req.query.limit);

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    return next(new AppError(400, 'INVALID_LIMIT', `limit must be an integer between 1 and ${maxLimit}.`));
  }
  res.locals.limit = limit;
  next();
}

export function validateSwipe(req, res, next) {
  const { targetId, action } = req.body ?? {};

  if (typeof targetId !== 'string' || !targetId.trim()) {
    return next(new AppError(400, 'INVALID_TARGET_ID', 'targetId must be a non-empty string.'));
  }
  if (!config.swipeActions.includes(action)) {
    return next(new AppError(400, 'INVALID_ACTION', `action must be one of: ${config.swipeActions.join(', ')}.`));
  }
  next();
}

export function validateMessage(req, res, next) {
  const text = req.body?.text;
  if (typeof text !== 'string' || !text.trim() || text.trim().length > 500) {
    return next(new AppError(400, 'INVALID_MESSAGE', 'text must be a non-empty string up to 500 characters.'));
  }
  res.locals.text = text.trim();
  next();
}

export function validateLogin(req, res, next) {
  if (!isValidPhone(req.body?.phone)) {
    return next(new AppError(400, 'INVALID_PHONE', 'phone must look like "+91 9876543210".'));
  }
  next();
}

export function validateAccountUpdate(req, res, next) {
  const body = req.body ?? {};
  const fields = Object.keys(body);

  if (!fields.length || fields.some((field) => !ACCOUNT_FIELDS.includes(field))) {
    return next(new AppError(400, 'INVALID_ACCOUNT_UPDATE', `Send one or more of: ${ACCOUNT_FIELDS.join(', ')}.`));
  }
  if (fields.includes('firstName') && !isValidFirstName(body.firstName)) {
    return next(new AppError(400, 'INVALID_FIRST_NAME', 'firstName must be 1 to 30 letters.'));
  }
  if (fields.includes('email') && !isValidEmail(body.email)) {
    return next(new AppError(400, 'INVALID_EMAIL', 'email must be a valid email address.'));
  }
  if (fields.includes('alertsEnabled') && typeof body.alertsEnabled !== 'boolean') {
    return next(new AppError(400, 'INVALID_ALERTS', 'alertsEnabled must be true or false.'));
  }

  const changes = { ...body };
  if (changes.firstName) changes.firstName = changes.firstName.trim();
  if (changes.email) changes.email = changes.email.trim().toLowerCase();
  res.locals.changes = changes;
  next();
}
