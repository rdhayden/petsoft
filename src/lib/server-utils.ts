import "server-only";
// server only is a safety feature, this just ensures the functions defined here 
// can't be used on client components

import { redirect } from "next/navigation";
import { auth } from '@/config/auth';
import { PetModel } from "@/generated/prisma/models";
import { prisma } from "./db";
import { User } from "@/generated/prisma/client";

 export async function checkAuth() {
    // the auth function returns the user if logged in or null
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }

    return session;
 }

 // in a larger app we would usually put all CRUD functions in a seperate ts file as the 
 // data access layer, but in this case we only really use read logic
 export async function getPetById(petId: PetModel['id']) {
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId
      },
      select: {
        userId: true,
      }
    });
    return pet;
  } catch {
    console.log('getPerById failed to fetch the pet from the database')
    return null;
  }
 }

  export async function getPetsByUserId(userId: User['id']) {
  try {
    const pet = await prisma.pet.findMany({
      where: {
        userId: userId
      },
    });
    return pet;
  } catch {
    console.log('getPerByUserId failed to fetch the pet from the database')
    return [];
  }
 }

 export async function getUserByEmail(email:User['email']) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  return user;
 }