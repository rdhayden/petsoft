'use client';

import { createContext, useState } from 'react';

type SearchContextProviderProps = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchQuery: string;
  handleSearchQueryChange: (query: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  // state
  const [searchQuery, setSearchQuery] = useState<string>('');

  //derived state

  // event handlers
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    // add any additional logic here if needed
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleSearchQueryChange }}>
      {children}
    </SearchContext.Provider>
  );
}
