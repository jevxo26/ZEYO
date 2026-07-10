// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  seed: 'ts-node prisma/seed.ts',
});