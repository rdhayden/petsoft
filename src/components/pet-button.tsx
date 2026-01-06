'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PetForm from './pet-form';
import { useState } from 'react';
import { flushSync } from 'react-dom';

type PetButtonProps = {
  actionType: 'add' | 'edit' | 'checkout';
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function PetButton({
  actionType,
  disabled,
  onClick,
  children,
}: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === 'checkout') {
    if (!onClick) {
      throw new Error(
        'PetButton must recieve an onClick funtion when actionType is checkout'
      );
    }
    return (
      <Button variant="secondary" disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }

  // See https://ui.shadcn.com/docs/components/dialog for reference
  // Also note use of asChild to wrap the trigger around custom components
  // See https://www.radix-ui.com/primitives/docs/guides/composition
  // it pushes functionality down to the child component
  // In this case DialogTrigger renders a button by default, and we are wrapping
  // it around our custom Button component so without asChild it would render a button inside a button
  // creating an error

  // The flushSync is used to ensure the dialog closes immediately after form submission
  // This is necessary because onFormSubmission is one of many state changes made in the
  // function passed to the form's action (see pet-form.tsx), and React batches state updates
  // when multiple updates occur within the same event loop tick. Usually this is good for performance,
  // but in this case it causes the dialog to remain open until after the server action which writes
  // to the database, and we're deliberately using optimistic UI updates to give the impression
  // of speed.
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        {actionType === 'edit' ? (
          <Button variant="secondary">{children}</Button>
        ) : (
          <Button size="icon">
            <PlusIcon className="h-6 w-6" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'edit' ? 'Edit pet' : 'Add a new pet'}
          </DialogTitle>
        </DialogHeader>
        <PetForm
          actionType={actionType}
          onFormSubmission={() => {
            flushSync(() => {
              setIsFormOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
