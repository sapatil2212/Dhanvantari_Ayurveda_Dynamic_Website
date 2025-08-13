'use client';

import { useEffect, useState } from 'react';

interface AnimatedTickProps {
  className?: string;
  size?: number;
}

export function AnimatedTick({ className = '', size = 16 }: AnimatedTickProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isVisible ? 'scale(1)' : 'scale(0)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <path
        d="M20 6L9 17l-5-5"
        className="transition-all duration-500 ease-out"
        style={{
          strokeDasharray: '30',
          strokeDashoffset: isVisible ? '0' : '30',
        }}
      />
    </svg>
  );
}
