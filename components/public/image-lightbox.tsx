'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  const handlePrevious = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative flex items-center justify-center bg-black">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <img
              src={images[index]}
              alt={`Gallery image ${index + 1}`}
              className="max-h-[80vh] w-auto object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {index + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
