'use server';

import prisma from '@/lib/prisma';
import { sleep } from '@/lib/utils';
import { petFormSchema, petIdSchema } from '@/lib/validations';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

// Note this file is marked 'use server' so that all these functions execute server side wherever they're included

// --- user actions ---



// --- pet actions ---

// Next.js server actions must have 'use server' directive at the top of the file
// traditionally you would create api routes to handle server side logic
// and then call those api routes from the client side
// server actions abstracts away the details of creating api routes
// Next.js still creates the api routes behind the scenes for you
// network inspection will show post calls to the server action endpoints
// in this case

// Note the argument pet is of type unknown, this is because data coming from
// the client side should always be treated as untrusted, by using unknown
// we force ourselves to validate the data before using it or else we'll get
// Typescript errors
export async function addPet(pet: unknown) {
  await sleep(1000); // Simulate a delay for demonstration purposes

  // .parse will throw an error if validation fails, .safeParse returns an object
  // with success boolean and either data or error properties
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: 'Validation failed', errors: validatedPet.error.message };
  }

  // We add the User to the data recieved from the form, we get this from
  // the next-auth session, and prisma uses this connect object when its 
  // creating a reference to another oject, a foreign key in relational DB terms
  // Also note User was declared with a capital U in the schema, that was a mistake
  // but npx prisma db push, does not seem to be updating after changing it
  // in the prisma schema, so have parked troubleshooting that for now
  try {
    await prisma.pet.create({
      data: { 
        ...validatedPet.data,
      }
    });
  } catch {
    return { message: 'Error adding pet' };
  }

  // After writing data to the database we need to refresh the relevant
  // parts of the UI to reflect the new data
  // revalidatePath is one way to do this, it will re-fetch the data
  // the arguments are the path to revalidate and the component name
  // in this case the layout because that's where the data is fetched
  revalidatePath('/app', 'layout');
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000); // Simulate a delay for demonstration purposes

  // validation
  const validatedPetId = petIdSchema.safeParse(petId).data;
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success || !validatedPetId) {
    return { message: 'Invalid pet data' };
  }

  // database mutation
  try {
    await prisma.pet.update({
      where: { id: validatedPetId },
      data: validatedPet.data,
    });
  } catch {
    return { message: 'Error editing pet' };
  }
  revalidatePath('/app', 'layout');
}

export async function deletePet(petId: unknown) {
  await sleep(1000); // Simulate a delay for demonstration purposes

  // validation
  const validatedPetId = petIdSchema.safeParse(petId).data;
  if (!validatedPetId) {
    return { message: 'Invalid pet ID' };
  }

  // database mutation
  try {
    await prisma.pet.delete({
      where: { id: validatedPetId },
    });
  } catch {
    return { message: 'Error deleting pet' };
  }
  revalidatePath('/app', 'layout');
}