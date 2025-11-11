'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cardHoverVariants } from '@/lib/utils/animations';

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    location: string;
    price: number;
    rating: number;
    image: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      className="h-full"
    >
      <Card className="group overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <motion.div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${property.image})` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{property.name}</h3>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </div>
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
            </motion.div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold">${property.price}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
              <Link href={`/rooms/${property.id}`}>View Details</Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
