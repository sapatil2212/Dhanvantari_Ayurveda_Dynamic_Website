'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    const autoScroll = () => {
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 2;
      }
    };

    const interval = setInterval(autoScroll, 50);
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        {/* Auto-scroll Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isAutoScrolling
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isAutoScrolling ? 'Pause Auto-scroll' : 'Start Auto-scroll'}
          </button>
        </div>

        {/* Gallery Grid */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredImages.map((image) => (
            <div
              key={image.id}
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

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-black border-0">
            <div className="relative w-full h-full flex items-center justify-center">
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
