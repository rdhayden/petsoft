'use client';

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type AuthFormButtonProps = {
  submitLabel: 'Sign up' | 'Log in';
};

export default function AuthFormButton({ submitLabel }: AuthFormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending}>{submitLabel}</Button>
  )
}
