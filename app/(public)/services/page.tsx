'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Car,
  Sparkles,
  Shirt,
  Briefcase,
  Baby,
  Dog,
  Shield,
  Clock,
  Users,
  Wine,
  Plane,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ServicesPage() {
  const services = [
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      description:
        'Complimentary high-speed internet access throughout the hotel, perfect for both leisure and business travelers.',
      category: 'Complimentary',
      featured: true,
    },
    {
      icon: Coffee,
      title: 'Breakfast Buffet',
      description:
        'Start your day with our extensive breakfast buffet featuring local and international cuisine.',
      category: 'Dining',
      featured: true,
    },
    {
      icon: Utensils,
      title: '24/7 Room Service',
      description:
        'Enjoy delicious meals and snacks delivered to your room any time of day or night.',
      category: 'Dining',
      featured: false,
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description:
        'State-of-the-art gym equipment available 24/7 to maintain your fitness routine.',
      category: 'Wellness',
      featured: true,
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description:
        'Relax in our heated outdoor pool with stunning city views, open from 6 AM to 10 PM.',
      category: 'Wellness',
      featured: true,
    },
    {
      icon: Sparkles,
      title: 'Spa & Wellness',
      description:
        'Indulge in rejuvenating spa treatments, massages, and wellness therapies.',
      category: 'Wellness',
      featured: false,
    },
    {
      icon: Car,
      title: 'Free Parking',
      description:
        'Complimentary parking for all guests with valet service available upon request.',
      category: 'Complimentary',
      featured: true,
    },
    {
      icon: Shirt,
      title: 'Laundry Service',
      description:
        'Professional laundry and dry cleaning services with same-day delivery available.',
      category: 'Convenience',
      featured: false,
    },
    {
      icon: Briefcase,
      title: 'Business Center',
      description:
        'Fully equipped business center with meeting rooms, printing, and conference facilities.',
      category: 'Business',
      featured: false,
    },
    {
      icon: Baby,
      title: 'Babysitting Service',
      description:
        'Professional childcare services available upon request for your peace of mind.',
      category: 'Family',
      featured: false,
    },
    {
      icon: Dog,
      title: 'Pet-Friendly',
      description:
        'We welcome your furry friends! Pet amenities and services available.',
      category: 'Family',
      featured: false,
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description:
        'Round-the-clock security personnel and modern surveillance systems for your safety.',
      category: 'Complimentary',
      featured: true,
    },
    {
      icon: Clock,
      title: 'Concierge Service',
      description:
        'Our knowledgeable concierge team is ready to assist with reservations, tours, and recommendations.',
      category: 'Convenience',
      featured: true,
    },
    {
      icon: Users,
      title: 'Event Spaces',
      description:
        'Versatile event spaces for weddings, conferences, and special occasions with full catering.',
      category: 'Business',
      featured: false,
    },
    {
      icon: Wine,
      title: 'Bar & Lounge',
      description:
        'Sophisticated bar and lounge area serving premium cocktails, wines, and light bites.',
      category: 'Dining',
      featured: false,
    },
    {
      icon: Plane,
      title: 'Airport Shuttle',
      description:
        'Convenient airport transportation service available for arrivals and departures.',
      category: 'Convenience',
      featured: false,
    },
  ];

  const categories = [
    'All',
    'Complimentary',
    'Dining',
    'Wellness',
    'Business',
    'Convenience',
    'Family',
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((service) => service.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-200"
          >
            Everything You Need for a Perfect Stay
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              {selectedCategory === 'All'
                ? 'All Services'
                : `${selectedCategory} Services`}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of services to ensure your stay is
              comfortable, convenient, and memorable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`h-full hover:shadow-lg transition-all ${
                    service.featured ? 'border-primary/50' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        <service.icon className="w-6 h-6" />
                      </div>
                      {service.featured && (
                        <Badge variant="default">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {service.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Amenities Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">In-Room Amenities</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              'Air Conditioning',
              'Flat-screen TV',
              'Mini Bar',
              'Safe Deposit Box',
              'Coffee Maker',
              'Hair Dryer',
              'Iron & Board',
              'Premium Bedding',
              'Work Desk',
              'Telephone',
              'Blackout Curtains',
              'Daily Housekeeping',
            ].map((amenity, index) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-4 bg-background rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium">{amenity}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Experience Premium Hospitality
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Book your stay today and enjoy all our exceptional services
                  and amenities
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/rooms"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Rooms
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
