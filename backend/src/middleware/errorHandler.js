import { AppError } from '../utils/AppError.js';

const sendError = (res, status, code, message) => res.status(status).json({ error: { code, message } });

export function errorHandler(error, req, res, next) {
  if (error instanceof AppError) return sendError(res, error.status, error.code, error.message);
  if (error.type === 'entity.parse.failed') return sendError(res, 400, 'INVALID_JSON', 'Request body is not valid JSON.');

  console.error(error);
  return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
}
