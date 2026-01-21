import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { uuid } from "zod";

export const petsTable = sqliteTable("pets_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text(),
    ownerName: text(),
    imageUrl: text(),
    age: int(),
    notes: text(),
    createdAt: int().default(Date.now()),
    updatedAt: int().default(Date.now()),
});