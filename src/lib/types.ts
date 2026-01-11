import { PetModel } from '@/generated/prisma/models';

// By referencing the PetModel from Prisma we only have to update our
// Prisma model for changes to be reflected everywhere
export type Pet = Omit<PetModel, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
