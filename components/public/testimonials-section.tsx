'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Business Traveler',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    quote:
      'Absolutely wonderful experience! The staff was incredibly friendly and the room was spotless. Will definitely be returning on my next business trip.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Vacation Guest',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    quote:
      'The perfect getaway! Beautiful location, amazing amenities, and exceptional service. My family had an unforgettable vacation here.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Honeymoon Couple',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    quote:
      'Our honeymoon was magical thanks to this hotel. The romantic atmosphere and attention to detail made our stay truly special.',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

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
                <p className="text-lg italic text-muted-foreground">
                  "{currentTestimonial.quote}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentTestimonial.image})` }}
                  />
                  <div>
                    <div className="font-semibold">{currentTestimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentTestimonial.title}
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

        {/* Dots Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-teal-600 w-8'
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
