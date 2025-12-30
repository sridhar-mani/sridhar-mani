import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DecryptTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export const DecryptText = ({ text, className = '', delay = 0, duration = 1500 }: DecryptTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          
          setTimeout(() => {
            setIsAnimating(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isAnimating) return;

    let iteration = 0;
    const totalIterations = text.length * 3;
    const intervalTime = duration / totalIterations;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < Math.floor(iteration / 3)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration >= totalIterations) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAnimating, text, duration]);

  return (
    <motion.span
      ref={elementRef}
      className={`font-mono ${className}`}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {displayText}
    </motion.span>
  );
};
