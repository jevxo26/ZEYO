const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$queryRaw`SELECT 1`
  .then(() => { console.log('✅ NeonDB is awake'); return p.$disconnect(); })
  .catch(e => { console.log('❌ Error:', e.message); return p.$disconnect(); });
