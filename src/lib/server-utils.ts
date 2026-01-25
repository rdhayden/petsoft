'server only';

import {drizzleDb} from '@/lib/utils';
import {petsTable} from '@/db/schema';

export async function getPets() {

  const pets = await drizzleDb.select({
    id: petsTable.id,
    name: petsTable.name,
    ownerName: petsTable.ownerName,
    imageUrl: petsTable.imageUrl,
    age: petsTable.age,
    notes: petsTable.notes,
  }).from(petsTable);

  return pets;
 }