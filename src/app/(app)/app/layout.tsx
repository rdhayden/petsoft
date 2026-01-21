import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import { Toaster } from 'sonner';
import { getPets } from '@/lib/server-utils';
import { SignIn } from "@/components/auth-components";
import { auth } from "@/lib/auth";
import { getUserPaidStatus } from '@/actions/actions';
import { get } from 'http';
import { is } from 'zod/v4/locales';
import { redirect } from 'next/navigation';
import { Coming_Soon } from 'next/font/google';
import { Console } from 'console';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPets();
  
  // Contexts are client components but wrapping components in a context provider
  // does not make everything wrapped client components, you can pass server components
  // through to client components as children, it is only when you import into a client
  // component that everything imported and their imports become client components

  // also note the Toaster does not render until it is triggered to show a toast
  // we trigger the toast to show errors in the pet-form component
  return (
    <>
      <BackgroundPattern />
      <div className="flex flex-col min-h-screen max-w-5xl mx-auto px-4"> 
            <AppHeader />
            <SearchContextProvider>
              <PetContextProvider data={data}>{children}</PetContextProvider>
            </SearchContextProvider>
            <AppFooter />
      </div>

      <Toaster position="top-center" />
    </>
  );
}
