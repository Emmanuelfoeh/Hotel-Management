'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Read URL params on mount
  useEffect(() => {
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    
    if (checkInParam) setCheckIn(checkInParam);
    if (checkOutParam) setCheckOut(checkOutParam);
    if (guestsParam) setGuests(guestsParam);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    
    const url = `/rooms?${params.toString()}`;
    
    // Force refresh if already on rooms page
    if (pathname === '/rooms') {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-xl dark:bg-card md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2 min-h-[44px] touch-manipulation">
        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border-0 p-0 focus-visible:ring-0 min-h-[32px]"
          placeholder="Check-in"
        />
      </div>

      <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2 min-h-[44px] touch-manipulation">
        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border-0 p-0 focus-visible:ring-0 min-h-[32px]"
          placeholder="Check-out"
        />
      </div>

      <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2 min-h-[44px] touch-manipulation">
        <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border-0 p-0 focus-visible:ring-0 min-h-[32px]"
          placeholder="Guests"
        />
      </div>

      <Button
        onClick={handleSearch}
        size="lg"
        className="bg-teal-600 hover:bg-teal-700 min-h-[44px] touch-manipulation w-full md:w-auto"
      >
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </div>
  );
}
