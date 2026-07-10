import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

// Load .env manually since prisma.config.ts intercepts environment loading
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema',
});
