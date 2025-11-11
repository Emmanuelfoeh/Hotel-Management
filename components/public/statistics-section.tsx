'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Building2, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '100+', label: 'Happy Customers' },
  { icon: Calendar, value: '15+', label: 'Years Experience' },
  { icon: Building2, value: '800+', label: 'Properties' },
  { icon: Award, value: '12+', label: 'Awards Won' },
];

export function StatisticsSection() {
  return (
    <section className="bg-teal-600 py-12 sm:py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center">
                <stat.icon className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{stat.value}</div>
              <div className="mt-2 text-sm sm:text-base text-teal-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
