'use client';

import { addPet, editPet, deletePet } from '@/actions/actions';
import { Pet } from '@/lib/types';
import { TPet } from '@/lib/types';
import { createContext, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type PetContextProviderProps = {
  data: TPet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: TPet[];
  selectedPetId: TPet['id'] | null;
  selectedPet: TPet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: Pet) => Promise<void>;
  handleEditPet: (petId: TPet['id'], newPetData: Pet) => Promise<void>;
  handleCheckoutPet: (petId: TPet['id']) => Promise<void>;
  handleChangeSelectedPet: (petId: TPet['id']) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state

  // the useOptimistic hook is used to manage optimistic UI updates
  // you have to use it either within a transition (useTransition)
  // or an async server action, such as a form action, we call setOptimistic
  // within handleAddPet which is called from the form action in pet-form.tsx
  // react then immediately updates the UI with the new pet, but when the server action
  // completes it re-renders with the data from the database, which includes
  // the new pet with its real id from the database, that means that if there's an
  // error adding the pet to the database, the optimistic pet is removed again
  // If its used within a transition the UI is updated immediately, but when the
  // transition completes it re-renders with the final data
  // Note that there may still be some issues, for example if the user adds
  // a pet and immediately tries to click on it to edit it, the pet may not
  // show because the addPet server action hasn't completed yet and the last
  // thing addPet does is revalidate the path to fetch the latest data from the database
  // so the new pet won't appear until that happens
  // it takes 2 arguments, the initial state and a function that defines
  // how to update the state optimistically, it returns the current state
  // and a function to update the state usually called setOptimistic[nameOfState]
  // the set function takes a single argument which is passed to the updater function
  // in this case we need to handle 3 types of updates (add, edit, delete) so we
  // pass an object with an action and payload so we can have different logic
  // for each type of update
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case 'add':
          const newPet: Pet = {
            id: 99999 + Math.random().toString(), // temporary id, could clash eventually, should use cuid and prefix with 'optimistic' 
            ...payload,
          };
          return [...state, newPet];
        case 'edit':
          const { petId, newPetData } = payload;
          return state.map((pet) =>
            pet.id === petId ? { ...pet, ...newPetData } : pet
          );
        case 'delete':
          const idToDelete = payload;
          return state.filter((pet) => pet.id !== idToDelete);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<TPet['id'] | null>(null);

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // Note the toast triggered on error after invoking the server action, triggers a Toaster
  // which is defined in the layout component. You can trigger it in success, warning
  // error and other ways e.g. toast.success('Success!'). Comment out one of the fields
  // in the data object object passed to prisma.pet.create in actions.ts (e.g. age field)
  // to see the error toast in action
  const handleAddPet = async (newPet: Pet) => {
    setOptimisticPets({ action: 'add', payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  // event handlers
  const handleEditPet = async (petId: TPet['id'], newPetData: Pet) => {
    setOptimisticPets({ action: 'edit', payload: { petId, newPetData } });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: TPet['id']) => {
    setOptimisticPets({ action: 'delete', payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectedPet = (petId: TPet['id']) => {
    setSelectedPetId(petId);
    // add any additional logic here if needed
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleEditPet,
        handleAddPet,
        handleCheckoutPet,
        handleChangeSelectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
