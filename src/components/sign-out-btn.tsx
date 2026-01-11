'use client'

import { useTransition } from "react";
import { Button } from "./ui/button"
import { logOut } from '@/actions/actions';

// extracting this into its own component so we can make it a client component 
// to use onClick, we can still trigger server actions from the client, in this case logOut
export default function SignOutButton() {
    const [isPending, startTransition] = useTransition();

    return <Button onClick={async () => {
        startTransition(async () => {
            await logOut()
        });
    }} disabled={isPending}>Sign out</Button>
}