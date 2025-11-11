'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from './search-bar';

export function StickySearchBar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${
        isSticky
          ? 'fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md py-4'
          : 'relative py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <SearchBar />
      </div>
    </div>
  );
}
