'server only';

import { drizzleDb } from ./utils;

export async function getPets() {
  const db = drizzle(process.env.DATABASE_URL);

  const pets = await db.select({
    field1: petsTable.name,
    field2: petsTable.ownerName,
    field3: petsTable.imageUrl,
    field4: petsTable.age,
    field5: petsTable.notes,
  }).from(petsTable);
    console.log('Getting all users from the database: ', pets)

  return pets;
 }