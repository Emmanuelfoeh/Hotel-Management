'use client';

import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { buttonHoverVariants } from '@/lib/utils/animations';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  className,
  variant,
  size,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      variants={buttonHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="inline-block"
    >
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
