import cors from 'cors';
import express from 'express';
import { config } from './config/index.js';
import { createJsonStore } from './repositories/jsonStore.js';
import { createFeedService } from './services/feedService.js';
import { createSwipeService } from './services/swipeService.js';
import { createMatchesService } from './services/matchesService.js';
import { createAccountService } from './services/accountService.js';
import { createProfileService } from './services/profileService.js';
import { createDemoService } from './services/demoService.js';
import { createFeedController } from './controllers/feedController.js';
import { createSwipeController } from './controllers/swipeController.js';
import { createMatchesController } from './controllers/matchesController.js';
import { createAccountController } from './controllers/accountController.js';
import { createMeController } from './controllers/meController.js';
import { createDemoController } from './controllers/demoController.js';
import { createRoutes } from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp({ dataFile = config.dataFile } = {}) {
  const store = createJsonStore({ dataFile, seedFile: config.seedFile });
  const deps = { store, currentUserId: config.currentUserId };

  const routes = createRoutes({
    feed: createFeedController(createFeedService(deps)),
    swipe: createSwipeController(createSwipeService(deps)),
    matches: createMatchesController(createMatchesService(deps)),
    me: createMeController(createProfileService(deps)),
    account: createAccountController(createAccountService(deps)),
    demo: createDemoController(createDemoService({ store, seedFile: config.seedFile })),
  });

  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  // Public Vercel path is /api/* (service receives the original path).
  // Root mount keeps local npm start / tests working without the prefix.
  app.use('/api', routes);
  app.use(routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
