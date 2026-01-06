'use client';

import { useSearchContext } from '@/lib/hooks';

export default function SearchForm() {
  const { handleSearchQueryChange } = useSearchContext();

  // Note giving the input type="search" enables some browsers to show a button that clears the input
  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        placeholder="Search pets"
        type="search"
        onChange={(e) => handleSearchQueryChange(e.target.value)}
      />
    </form>
  );
}
