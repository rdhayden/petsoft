import { petsTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

// By referencing the TPet from schema we only have to update our
// drizzle schema for changes to be reflected everywhere
export type TPet = InferSelectModel<typeof petsTable>;
export type Pet = Omit<TPet, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
