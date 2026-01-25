import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from 'drizzle-zod';

export const petsTable = sqliteTable("pets_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    ownerName: text().notNull(),
    imageUrl: text().notNull(),
    age: int().notNull(),
    notes: text().default(""),
    createdAt: int().default(Date.now()),
    updatedAt: int().default(Date.now()),
});

export const petsZodSchema = createSelectSchema(petsTable);
