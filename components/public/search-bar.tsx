'use client';

import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    });
    router.push(`/rooms?${params.toString()}`);
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
