'use client';

import H1 from "@/components/h1";
import PaymentButton from "@/components/payment-btn";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";


export default function page( {searchParams}: {searchParams: {[key: string]: string | string[] | undefined}} ) {
  // if we were using a component we'd use useSearchParams
  // but page.tsx gets the search params passed in directly
    const [isPending, startTransition] = useTransition();
  const { update } = useSession();
    const router = useRouter();
    
    return (
    <main className="flex flex-col items-center space-y-10">
        <H1>Petsoft access requires payment</H1>

        { !searchParams.success && (
            
            <PaymentButton>Buy lifetime access for $299</PaymentButton>
        )}

        { searchParams.success && (
            <>
                <Button onClick={async () => {
                    await update(true);
                    router.push('/app/dashboard');
                }}>Go to dashboard</Button>
                <p className="text-sm text-green-700">Payment successful! You now have lifetime access to Petsoft.</p>
            </>
        )}
        { searchParams.canceled && (
            <p className="text-sm text-red-700">Payment canceled. You can try again.</p>
        )}
    </main>
  )
}
