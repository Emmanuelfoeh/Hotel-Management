'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPublicReviews } from '@/actions/public-review.actions';

interface TestimonialsSectionProps {
  reviews: Awaited<ReturnType<typeof getPublicReviews>>['data'];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Customer Say About Our Services
          </h2>
          <p className="mt-2 text-muted-foreground">
            Read what our guests have to say about their experiences
          </p>
        </motion.div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <Card>
              <CardContent className="p-8">
                <Quote className="h-12 w-12 text-teal-600 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg italic text-muted-foreground">
                  "{currentReview.comment}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                    {currentReview.customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {currentReview.customer.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentReview.customer.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-2 md:hidden">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_review: typeof reviews[0], index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-teal-600 w-8'
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
