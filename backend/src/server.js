import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

// Default export for Vercel Express detection (src/server.js).
export default app;

app.listen(config.port, () => {
  console.log(`Coy Discover API listening on http://localhost:${config.port}`);
});
