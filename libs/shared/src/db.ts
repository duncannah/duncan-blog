import { PrismaClient } from "@prisma/client";

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// weird but this is the only way to make it work
export const prisma = typeof window === `undefined` ? global.prisma || new PrismaClient({}) : ((() => null) as unknown as PrismaClient);

if (process.env[`NODE_ENV`] !== `production`) global.prisma = prisma;
