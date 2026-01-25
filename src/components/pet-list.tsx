'use client';

import { usePetContext, useSearchContext } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { array, object } from 'zod';

// Note that the imageUrl passed to the Image component is from images.unsplash.com
// so this domain is added to next.config.mjs, Next.js blocks any external image domains
// that are not explicitly allowed for security and performance reasons

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPet } = usePetContext();
  const { searchQuery } = useSearchContext();

  // for (const pet of pets) {
  //   console.log(pet);
  // }

  // filter pets based on search query
  const filteredPets = searchQuery ? pets.filter((pet) =>
    pet.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : pets;

  // note that on the Image component we set the width and height props
  // even though we override them with className styles because Next requires
  // width and height to be set for remote images to prevent Cumulative Layout Shift
  // however when rendering it treats the width and height props like a ratio and ensures
  // the maximum dimension of the image fits within those bounds which sometimes results
  // in images not being displayed as expected, so setting dimensions via className explicitly
  // ensures the images are always the correct size

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPet(pet.id)}
            className={cn(
              'flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition',
              {
                'bg-[#EFF1F2]': selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className="h-[45px] w-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
