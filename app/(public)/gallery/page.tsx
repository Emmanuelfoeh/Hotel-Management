'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageLightbox } from '@/components/public/image-lightbox';

const galleryImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
];

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold md:text-5xl">Our Gallery</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our beautiful hotels and stunning locations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </motion.div>
        ))}
      </div>

      <ImageLightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
