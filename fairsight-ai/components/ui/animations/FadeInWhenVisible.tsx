'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export const FadeInWhenVisible = ({ 
  children, 
  delay = 0, 
  className = '',
  once = true
}: FadeInWhenVisibleProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWhenVisible; 