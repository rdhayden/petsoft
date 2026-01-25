import 'dotenv/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { drizzle } from 'drizzle-orm/libsql';

export const drizzleDb = drizzle(process.env.DB_FILE_NAME!);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
