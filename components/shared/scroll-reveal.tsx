'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { scrollRevealVariants } from '@/lib/utils/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      variants={scrollRevealVariants}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredScrollRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggeredScrollReveal({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggeredScrollRevealProps) {
  return (
    <>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          once={once}
          className={className}
        >
          {child}
        </ScrollReveal>
      ))}
    </>
  );
}
