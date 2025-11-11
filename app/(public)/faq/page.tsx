'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    {
      name: 'Booking & Reservations',
      icon: '📅',
      faqs: [
        {
          question: 'How do I make a reservation?',
          answer:
            'You can make a reservation through our website by selecting your desired room, choosing your check-in and check-out dates, and completing the booking form. Alternatively, you can call our front desk at +1 (555) 123-4567 or email us at reservations@hotel.com.',
        },
        {
          question: 'Can I modify or cancel my reservation?',
          answer:
            'Yes, you can modify or cancel your reservation up to 24 hours before your check-in date without any penalty. To make changes, please contact our reservations team or log into your account on our website. Cancellations made less than 24 hours before check-in may incur a one-night charge.',
        },
        {
          question: 'What is your cancellation policy?',
          answer:
            'Free cancellation is available up to 24 hours before your scheduled check-in time. Cancellations made within 24 hours of check-in will be charged for one night. No-shows will be charged for the full reservation amount. Special rates and packages may have different cancellation policies.',
        },
        {
          question: 'Do you offer group bookings or corporate rates?',
          answer:
            'Yes, we offer special rates for group bookings (10+ rooms) and corporate clients. Please contact our sales team at sales@hotel.com or call +1 (555) 123-4568 for customized quotes and packages.',
        },
      ],
    },
    {
      name: 'Check-in & Check-out',
      icon: '🔑',
      faqs: [
        {
          question: 'What are your check-in and check-out times?',
          answer:
            'Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges. Please contact the front desk in advance if you need special arrangements.',
        },
        {
          question: 'Can I request early check-in or late check-out?',
          answer:
            'Yes, early check-in and late check-out are available upon request and subject to availability. Early check-in (before 12:00 PM) and late check-out (after 2:00 PM) may incur a fee of 50% of the nightly rate. Please contact us in advance to arrange.',
        },
        {
          question: 'What do I need to bring for check-in?',
          answer:
            "Please bring a valid government-issued photo ID (driver's license, passport, or national ID card) and the credit card used for booking. If someone else made the reservation for you, please bring a copy of their ID and authorization letter.",
        },
        {
          question: 'Is there an age requirement for check-in?',
          answer:
            'Guests must be at least 18 years old to check in. Guests under 18 must be accompanied by a parent or legal guardian.',
        },
      ],
    },
    {
      name: 'Rooms & Amenities',
      icon: '🛏️',
      faqs: [
        {
          question: 'What amenities are included in the rooms?',
          answer:
            'All rooms include free WiFi, flat-screen TV, air conditioning, mini bar, safe deposit box, coffee maker, hair dryer, iron and ironing board, premium bedding, work desk, and daily housekeeping. Some room types include additional amenities like balconies, kitchenettes, or separate living areas.',
        },
        {
          question: 'Do you have accessible rooms?',
          answer:
            'Yes, we have ADA-compliant accessible rooms with features such as wider doorways, roll-in showers, grab bars, lowered fixtures, and visual alert systems. Please request an accessible room when making your reservation.',
        },
        {
          question: 'Can I request a specific room or floor?',
          answer:
            'Yes, you can request a specific room type, floor, or view preference when booking. While we cannot guarantee specific room assignments, we will do our best to accommodate your preferences based on availability.',
        },
        {
          question: 'Are smoking rooms available?',
          answer:
            'Our hotel is 100% non-smoking. Smoking is only permitted in designated outdoor areas. A cleaning fee of $250 will be charged for smoking in guest rooms or indoor areas.',
        },
      ],
    },
    {
      name: 'Services & Facilities',
      icon: '🏊',
      faqs: [
        {
          question: 'Do you have a fitness center and pool?',
          answer:
            'Yes, we have a 24-hour fitness center with modern equipment and a heated outdoor pool open from 6:00 AM to 10:00 PM daily. Both facilities are complimentary for all guests.',
        },
        {
          question: 'Is breakfast included?',
          answer:
            'Breakfast inclusion depends on your room rate. Some packages include complimentary breakfast buffet (7:00 AM - 10:00 AM). If not included, breakfast is available for purchase at $25 per person. Check your booking confirmation for details.',
        },
        {
          question: 'Do you offer airport shuttle service?',
          answer:
            'Yes, we offer airport shuttle service for $35 per person (one way) or $60 per person (round trip). Please book at least 24 hours in advance by contacting the concierge. Shuttles run every 2 hours from 6:00 AM to 10:00 PM.',
        },
        {
          question: 'Is parking available?',
          answer:
            'Yes, we offer complimentary self-parking for all guests. Valet parking is available for $25 per day. Electric vehicle charging stations are available for $10 per charge.',
        },
      ],
    },
    {
      name: 'Payments & Billing',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and cash. A valid credit card is required at check-in for incidentals, even if the room is prepaid.',
        },
        {
          question: 'When will I be charged for my reservation?',
          answer:
            'For standard bookings, your card will be charged at check-in. For prepaid or non-refundable rates, payment is processed immediately upon booking. A pre-authorization hold may be placed on your card before arrival.',
        },
        {
          question: 'What is the security deposit policy?',
          answer:
            'We require a security deposit of $100 per night (or a credit card authorization) at check-in to cover incidentals. The deposit will be refunded within 3-5 business days after check-out, minus any charges incurred during your stay.',
        },
        {
          question: 'Do you charge resort fees?',
          answer:
            'No, we do not charge resort fees. All amenities including WiFi, fitness center, pool access, and local calls are included in your room rate at no additional cost.',
        },
      ],
    },
    {
      name: 'Policies',
      icon: '📋',
      faqs: [
        {
          question: 'Are pets allowed?',
          answer:
            "Yes, we are pet-friendly! We welcome dogs and cats up to 50 lbs. There is a non-refundable pet fee of $75 per stay. Please inform us in advance if you're bringing a pet. Service animals are always welcome at no charge.",
        },
        {
          question: 'What is your policy on additional guests?',
          answer:
            'Room rates are based on double occupancy. Additional guests are charged $25 per person per night. Maximum occupancy varies by room type and is strictly enforced for safety reasons. Children under 12 stay free when using existing bedding.',
        },
        {
          question: 'Can I bring visitors to my room?',
          answer:
            'Registered guests may have visitors in their rooms between 8:00 AM and 10:00 PM. All visitors must check in at the front desk and provide valid ID. Overnight visitors must be registered as additional guests and will incur the additional guest fee.',
        },
        {
          question: 'What items are prohibited in the hotel?',
          answer:
            'Prohibited items include weapons, illegal drugs, fireworks, candles, incense, hot plates, and any items that pose a fire or safety hazard. Smoking is prohibited in all indoor areas. Violation of these policies may result in immediate eviction without refund.',
        },
      ],
    },
  ];

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm mb-4"
          >
            <HelpCircle className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200"
          >
            Find answers to common questions
          </motion.p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No results found for &quot;{searchQuery}&quot;. Try
                    different keywords or browse our categories below.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      {category.name}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex;
                      const isOpen = openIndex === globalIndex;

                      return (
                        <Card
                          key={faqIndex}
                          className="overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-semibold text-lg">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                isOpen ? 'transform rotate-180' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CardContent className="px-6 pb-6 pt-0">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </CardContent>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can&apos;t find the answer you&apos;re looking for? Our friendly
              team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+15551234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +1 (555) 123-4567
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
