'use client';

import { usePetContext } from '@/lib/hooks';
import Image from 'next/image';
import PetButton from './pet-button';
import { PetModel } from '@/generated/prisma/models';

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  // note we make the whole section a flex column to allow the notes section
  // to take up the remaining space with flex-1
  // and we create functions for each sub-section to make the code easier to read
  return (
    <section className="h-full w-full flex flex-col">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar selectedPet={selectedPet} />
          <OtherInfoRow selectedPet={selectedPet} />
          <NotesSection selectedPet={selectedPet} />
        </>
      )}
    </section>
  );
}

type Props = { selectedPet: PetModel };

function TopBar({ selectedPet }: Props) {
  // If we want a loading state for the checkout button, we can use useTransition
  // to track the pending state of the server action, to do this uncomment useTransition below
  // and add disabled={isPending} to the PetButton props for PetButon with actionType checkout
  // useTransition allows us to wrap the server action in the startTransition function
  // which then sets the isPending state to true when it is triggered
  // we can then use the isPending state to provide user feedback while waiting for a response
  // const [ isPending, startTransition ] = useTransition();

  const { handleCheckoutPet } = usePetContext();
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={selectedPet.imageUrl}
        alt="Selected pet image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">
        {selectedPet.name}
      </h2>

      <div className="ml-auto space-x-2">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          actionType="checkout"
          onClick={async () => await handleCheckoutPet(selectedPet.id)}
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfoRow({ selectedPet }: Props) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="text-lg mt-1 text-zinc-800">{selectedPet.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">age</h3>
        <p className="text-lg mt-1 text-zinc-800">{selectedPet.age}</p>
      </div>
    </div>
  );
}

function NotesSection({ selectedPet }: Props) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {selectedPet.notes}
    </section>
  );
}

function EmptyView() {
  return (
    <p className="text-2xl font-medium h-full flex justify-center items-center">
      No pet selected
    </p>
  );
}
