'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Ayurvedic treatment room with peaceful ambiance',
    category: 'Treatment Rooms'
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/3985169/pexels-photo-3985169.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Traditional Panchkarma therapy session',
    category: 'Treatments'
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/4113950/pexels-photo-4113950.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Herbal medicine preparation area',
    category: 'Facilities'
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/4498318/pexels-photo-4498318.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Consultation room with doctor',
    category: 'Consultation'
  },
  {
    id: 5,
    src: 'https://images.pexels.com/photos/4498310/pexels-photo-4498310.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Ayurvedic oils and herbs display',
    category: 'Medicines'
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/3985170/pexels-photo-3985170.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Relaxing therapy environment',
    category: 'Treatment Rooms'
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/4498321/pexels-photo-4498321.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Steam therapy room',
    category: 'Treatments'
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/3985168/pexels-photo-3985168.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Reception and waiting area',
    category: 'Facilities'
  },
  {
    id: 9,
    src: 'https://images.pexels.com/photos/4498315/pexels-photo-4498315.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Meditation and yoga space',
    category: 'Wellness'
  }
];

const categories = ['All', 'Treatment Rooms', 'Treatments', 'Facilities', 'Consultation', 'Medicines', 'Wellness'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Photo Gallery
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Take a virtual tour of our peaceful healing environment
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card
                key={image.id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                    <p className="text-emerald-200 text-xs">{image.category}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-white font-semibold">{selectedImage.alt}</h3>
              <p className="text-emerald-200 text-sm">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visit CTA */}
      <section className="py-16 px-4 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Our Healing Environment</h2>
          <p className="text-emerald-100 mb-8">
            Visit us to experience the peaceful and therapeutic atmosphere in person
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-emerald-800 hover:bg-emerald-50">
              Book a Visit
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-800">
              Get Directions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}