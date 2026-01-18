'server only';

import prisma from "./prisma";

export async function getPets() {
  try {
    const pet = await prisma.pet.findMany();
    return pet;
  } catch {
    console.log('getPets failed to fetch the pet from the database')
    return [];
  }
 }