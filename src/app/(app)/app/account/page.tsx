import ContentBlock from '@/components/content-block';
import H1 from '@/components/h1';
import { auth } from '@/lib/auth';
import { SignOut } from "@/components/auth-components";

export default async function AccountPage() {
  // middleware should redirect if the user isn't logged in so this will only render if there is a
  // session and user, but typescript doesn't know that so we have to make them conditional below
  return (
    <main>
      <H1 className="my-8 text-white">Account Page</H1>

      <ContentBlock className="h-[500px] flex flex-col gap=3 justify-center items-center">
        <p>Logged in as TBC</p>
        <div className='mt-4'>
          <SignOut/>
        </div>
      </ContentBlock>
    </main>
  );
}
