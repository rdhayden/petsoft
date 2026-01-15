'use server';

import { signIn, signOut } from '@/config/auth';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { checkAuth, getPetById } from '@/lib/server-utils';
import { sleep } from '@/lib/utils';
import { authSchema, petFormSchema, petIdSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { success } from 'zod';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!);

// Note this file is marked 'use server' so that all these functions execute server side wherever they're included

// --- user actions ---

export async function logIn(prevState: unknown, formData: unknown) {
  sleep(1000);

  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }
  
  try {
    await signIn('credentials', formData);
  } catch (error) {
    // redirects in Next.js are done using errors, so if you catch the redirect error Next does actually
    // redirect event though its configured to do that in auth.ts, the solution is to rethrow the redirect
    // error and then deal with all other errors, or remove the try catch of course but then if you need to 
    // deal with other errors you can't
    if (isRedirectError(error)) throw error;
    // using switch here because usually we'd have oauth errors too for google sign in etc
    // so we'd need to handle the error for each provider type 
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: 'Invalid email or password',
          };
        default:
          return {
            message: 'Could not log in',
          };
      }
    };
    return {
      message: 'Could not log in',
    };
  };
  
};

export async function logOut() {
  await sleep(1000);
  await signOut({redirectTo: '/'});
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: 'Invalid form data',
    };
  }

  // zod doesn't take FormData so convert it to an object first
  const formDataObject = Object.fromEntries(formData.entries());

  // validate the data with the zod schema we defined as authSchema
  const validatedFormData = authSchema.safeParse(formDataObject);
  if (!validatedFormData.success) {
    return {
      message: 'signUp passed invalid data'
    }
  }

  const {email, password} = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          message: 'Email already exists',
        };
      }
    }

    return {
      message: 'Could not create user in the database'
    }
  }

  // signIn still expects type FormData so we can't pass the validatedFormData.data which is
  // a vanilla object, but we've already done all the validation so we can pass it formData
  await signIn('credentials', formData);
}

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

  // authentication check
  const session = await checkAuth();

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
        User: {
          connect: {
            id: session.user.id
          }
        }
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

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId).data;
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success || !validatedPetId) {
    return { message: 'Invalid pet data' };
  }

  // authorization check
  const pet = await getPetById(validatedPetId);
  if (pet?.userId !== session.user.id) {
    return {
      message: 'Not authorized',
    };
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

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId).data;
  if (!validatedPetId) {
    return { message: 'Invalid pet ID' };
  }

  // authorization check, user is allowed to delete the pet with this ID
  const pet = await getPetById(validatedPetId);
  if (pet?.userId !== session.user.id) {
    return {
      message: 'Not authorized',
    };
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


// --- payment actions ---

export async function createCheckoutSession() {
  // authentication check, after sign up the user is redirected to sign in
  // sign in redirect the user to the payment page if they don't have an active subscription
  const session = await checkAuth();

  console.log("Creating checkout session for user:", session.user.email);

  // create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        { 
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
      cancel_url: `${process.env.CANONICAL_URL}/payment?canceled=true`, 
    });

  console.log("Checkout session created:", checkoutSession);

  // redirect to checkout
  redirect(checkoutSession.url);
}