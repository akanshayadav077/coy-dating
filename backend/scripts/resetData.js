import { promises as fs } from 'node:fs';
import { config } from '../src/config/index.js';

await fs.copyFile(config.seedFile, config.dataFile);
console.log('Data reset from seed.');
