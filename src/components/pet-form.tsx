'use client';

import { usePetContext } from '@/lib/hooks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PetFormButton from './pet-form-button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petFormSchema, TPetForm } from '@/lib/validations';
import { DEFAULT_PET_IMAGE_URL } from '@/config/constants';

type PetFormProps = {
  actionType?: 'add' | 'edit';
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, selectedPetId, handleAddPet, handleEditPet } =
    usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: selectedPet?.name,
      ownerName: selectedPet?.ownerName,
      imageUrl: selectedPet?.imageUrl,
      age: selectedPet?.age,
      notes: selectedPet?.notes,
    },
  });

  // - Note we trigger validation manually here on form submission because we're using
  // server actions and using the action attribute on the form element, and the alternative
  // of using handleSubmit from react hook form automatically triggers a client side submission
  // which we're not using here.
  // - Also note that trigger() returns a boolean indicating
  // whether the validation passed or not, the if statement checks this before proceeding
  // so that the form is not submitted if there are validation errors
  // - Also note that getValues() is used to get the form values, petData will be correctly
  // typed according to the TPetForm type defined above so it can safely passed to the handlers
  // however this gets the form data before any transformations defined in the Zod schema
  // so we are relying on the server to do the transformations e.g. default image URL, trimming etc
  return (
    <form
      action={async () => {
        const results = await trigger();
        if (!results) return;

        onFormSubmission();

        const petData = getValues();

        if (actionType === 'add') {
          await handleAddPet(petData);
        } else if (actionType === 'edit') {
          await handleEditPet(selectedPetId!, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Pet Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register('ownerName')} />
          {errors.ownerName && (
            <p className="text-sm text-red-600">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" {...register('imageUrl')} />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register('age')} />
          {errors.age && (
            <p className="text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} />
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormButton actionType={actionType} />
    </form>
  );
}
