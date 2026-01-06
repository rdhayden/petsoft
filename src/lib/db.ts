import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

// Next.js hot reloading can create multiple instances of the Prisma Client in dev
// So in dev we attach the prisma client to the global object and always check if it
// exists first before creating a new instance, effectively making it a singleton
// global.d.ts is created by the typescript compiler and has a 'global' constant that
// includes all global variables and in the last line we add prisma to it
// To do that we first need to cast the global object as an object which has a prisma property
// but we can't do this cast directly so have to cast to unknown first, then to the desired type
// Then we create the prisma client instance if it doesn't already exist
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
