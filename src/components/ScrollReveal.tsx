import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);

    // Safety fallback so content is never stuck hidden
    const fallbackTimer = window.setTimeout(() => setIsVisible(true), 900);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isVisible ? `${Math.min(delayMs, 360)}ms` : '0ms' }}
      className={`scroll-reveal-item ${isVisible ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
