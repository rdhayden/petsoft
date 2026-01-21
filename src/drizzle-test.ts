import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { petsTable } from './db/schema';

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
    const pets = await db.select({
    field1: petsTable.name,
    field2: petsTable.ownerName,
    field3: petsTable.imageUrl,
    field4: petsTable.age,
    field5: petsTable.notes,
  }).from(petsTable);
    console.log('Getting all users from the database: ', pets)
}

main();