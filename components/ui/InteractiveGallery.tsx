'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/assets/gallery/1.webp",
    alt: "Panchkarma Therapy",
    title: "Panchkarma Therapy",
    category: "Treatment"
  },
  {
    id: 2,
    src: "/assets/gallery/2.webp",
    alt: "Ayurvedic Massage",
    title: "Abhyanga Massage",
    category: "Massage"
  },
  {
    id: 3,
    src: "/assets/gallery/3.webp",
    alt: "Shirodhara Treatment",
    title: "Shirodhara",
    category: "Treatment"
  },
  {
    id: 4,
    src: "/assets/gallery/4.webp",
    alt: "Ayurvedic Herbs",
    title: "Natural Healing",
    category: "Herbs"
  },
  {
    id: 5,
    src: "/assets/gallery/5.webp",
    alt: "Medicinal Plants",
    title: "Herbal Remedies",
    category: "Herbs"
  },
  {
    id: 6,
    src: "/assets/gallery/6.webp",
    alt: "Ayurvedic Oils",
    title: "Medicated Oils",
    category: "Oils"
  },
  {
    id: 7,
    src: "/assets/gallery/7.webp",
    alt: "Doctor Consultation",
    title: "Expert Care",
    category: "Consultation"
  },
  {
    id: 8,
    src: "/assets/gallery/8.webp",
    alt: "Pulse Diagnosis",
    title: "Pulse Diagnosis",
    category: "Diagnosis"
  },
  {
    id: 9,
    src: "/assets/gallery/9.webp",
    alt: "Health Assessment",
    title: "Health Evaluation",
    category: "Assessment"
  }
];

export default function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  // Smooth auto-scroll using requestAnimationFrame
  const smoothAutoScroll = () => {
    if (!scrollContainerRef.current || !isAutoScrolling || isHovered) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Increment scroll position
    scrollPositionRef.current += 0.5; // Adjust speed here (0.5px per frame)

    // Reset when reaching the end
    if (scrollPositionRef.current >= maxScroll) {
      scrollPositionRef.current = 0;
    }

    // Apply the scroll
    container.scrollLeft = scrollPositionRef.current;

    // Continue the animation
    animationFrameRef.current = requestAnimationFrame(smoothAutoScroll);
  };

  const startAutoScroll = () => {
    if (!animationFrameRef.current && isAutoScrolling && !isHovered) {
      animationFrameRef.current = requestAnimationFrame(smoothAutoScroll);
    }
  };

  const stopAutoScroll = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev);
  };

  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Sync scroll position when user manually scrolls
  const handleScroll = () => {
    if (scrollContainerRef.current && !isAutoScrolling) {
      scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  // Initialize auto-scroll
  useEffect(() => {
    if (isAutoScrolling && !isHovered) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  }, [isAutoScrolling, isHovered]);

  // Reset scroll position when category changes
  useEffect(() => {
    scrollPositionRef.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedCategory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setZoomLevel(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
    setZoomLevel(1);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[prevIndex]);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case '+':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        resetZoom();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage]);

  return (
    <div className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Our Healing Environment
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Take a virtual tour of our peaceful clinic and see where your healing journey begins
          </p>
        </div>

        {/* Category Filter and Auto-scroll Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Auto-scroll toggle button */}
          <button
            onClick={toggleAutoScroll}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isAutoScrolling
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Auto-scroll
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Auto-scroll
              </>
            )}
          </button>
        </div>

        {/* Gallery Grid */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Duplicate images for seamless loop */}
          {[...filteredImages, ...filteredImages].map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="flex-shrink-0 w-80 h-64 group cursor-pointer"
              onClick={() => openModal(image)}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-sm text-emerald-200">{image.category}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-scroll indicator */}
        {isAutoScrolling && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span>Auto-scrolling • Hover to pause</span>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative w-[90vw] h-[80vh] max-w-4xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <button
                  onClick={handleZoomOut}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-all duration-300"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={resetZoom}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-all duration-300"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              {/* Image */}
              {selectedImage && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-full object-contain transition-transform duration-300"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  
                  {/* Image Info */}
                  <div className="absolute bottom-6 left-6 text-white bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <h3 className="font-semibold text-lg">{selectedImage.title}</h3>
                    <p className="text-sm text-emerald-200">{selectedImage.category}</p>
                    <p className="text-xs text-gray-300 mt-1">Zoom: {Math.round(zoomLevel * 100)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}