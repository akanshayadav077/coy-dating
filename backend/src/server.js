import { createApp } from './app.js';
import { config } from './config/index.js';

createApp().listen(config.port, () => {
  console.log(`Coy Discover API listening on http://localhost:${config.port}`);
});
