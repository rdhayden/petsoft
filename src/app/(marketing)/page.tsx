import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Check the next.configi.mjs file, the external domain must be added there
  // to allow loading images from that domain
  // Also remember Next.js is mobile-first, so xl:flex-row means it's flex-row for
  // anything greater than or equal to xl screen size

  // Also note the use of asChild for the radix button, see
  // https://www.radix-ui.com/primitives/docs/guides/composition#changing-the-element-type
  // This essentially lets you push the behavior and styles of the Button component to the Link component
  // @/components/ui/button.tsx applies asChild in the way described in the Radix docs
  // it spreads the props of the Button onto the child component and passes a ref
  // The Link component below becomes that child component using a Slot from Radix
  // The docs emphasize that when using asChild 'it is your responsibility to ensure it remains accessible and
  // functional' e.g. in this case the parent is a button so the child must support behaviours like
  // hover, focus, click, etc. Link does support these so it's fine in this case, but if it didn't
  // you wouldn't get the functionality of a button by just using asChild
  return (
    <main className="min-h-screen bg-[#5DC9A8] flex flex-col xl:flex-row items-center justify-center gap-10">
      <Image
        src="https://bytegrad.com/course-assets/react-nextjs/petsoft-preview.png"
        alt="PetSoft preview"
        width={519}
        height={472}
      />
      <div>
        <Logo />
        <h1 className="text-5xl font-semibold my-6 max-w-[500px]">
          Manage your <span className="font-extrabold">pet daycare</span> with
          ease
        </h1>
        <p className="text-2xl font-medium max-w-[600px]">
          Use Petsoft to easily keep track of the pets under your care. Get
          lifetime access for $299
        </p>
        <div className="mt-10 space-x-3">
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
