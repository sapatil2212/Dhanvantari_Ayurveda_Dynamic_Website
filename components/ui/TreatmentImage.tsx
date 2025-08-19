'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Leaf, Droplets, Wind, Zap, Heart } from 'lucide-react';

interface TreatmentImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export default function TreatmentImage({ 
  src, 
  fallbackSrc, 
  alt, 
  className = "", 
  icon,
  gradient = "from-emerald-500/20 to-emerald-600/20"
}: TreatmentImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else {
      // If fallback also fails, show placeholder
      setHasError(true);
    }
  };

  if (hasError && imageSrc === fallbackSrc) {
    // Show placeholder with icon
    return (
      <div className={`relative bg-gradient-to-br from-emerald-100 to-emerald-200 ${className} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
        <div className="relative z-10 text-center">
          {icon || <Leaf className="w-16 h-16 text-emerald-600 mx-auto mb-2" />}
          <p className="text-emerald-700 text-sm font-medium">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <Image 
      src={imageSrc}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={handleError}
    />
  );
}
