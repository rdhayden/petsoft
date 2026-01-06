import { Button } from './ui/button';

export default function PetFormButton({
  actionType,
}: {
  actionType?: 'add' | 'edit';
}) {
  // Comment out useFormStatus to get loading state, we're using optimistic
  // update for now which means we don't need to show the user loading status
  // Next.js automatically provides form status via useFormStatus hook
  // Its pending property is true when the form is being submitted
  // It has to be a separate component from the form because the form
  // uses server actions and server components cannot use hooks
  // If we're not using this we don't have to put this button in a separate component
  // const { pending } = useFormStatus();

  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === 'edit' ? 'Save Changes' : 'Add Pet'}
    </Button>
  );
}
