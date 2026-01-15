'use client';

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function PaymentButton({children}: {children: React.ReactNode}) {
    const [isPending, startTransition] = useTransition();
    return (
    <Button onClick={async () => {
        startTransition(async () => {
            await createCheckoutSession();
        });
    }} disabled={isPending}>{children}</Button>
  )
}
