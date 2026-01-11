import AppFooter from '@/components/app-footer';
import AppHeader from '@/components/app-header';
import BackgroundPattern from '@/components/background-pattern';
import PetContextProvider from '@/contexts/pet-context-provider';
import SearchContextProvider from '@/contexts/search-context-provider';
import { prisma } from '@/lib/db';
import { Toaster } from 'sonner';
import { checkAuth, getPetsByUserId } from '@/lib/server-utils';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch pet data from an API
  // const response = await fetch(
  //   'https://bytegrad.com/course-assets/projects/petsoft/api/pets'
  // );
  // if (!response.ok) {
  //   throw new Error('Failed to fetch pets');
  // }
  // const data: Pet[] = await response.json();

  const session = await checkAuth();
  const data = await getPetsByUserId(session.user.id);
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
