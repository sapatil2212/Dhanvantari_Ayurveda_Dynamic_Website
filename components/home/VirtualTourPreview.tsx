'use client';

import React, { useState } from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';

interface View {
  id: number;
  title: string;
  description: string;
  src: string;
}

const VirtualTourPreview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View | null>(null);

  const views = [
    {
      id: 1,
      title: "Reception / Waiting Area",
      description: "Our welcoming reception area where patients begin their healing journey",
      src: "https://www.google.com/maps/embed?pb=!4v1755603598986!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQy1nY2ZHRmc.!2m2!1d20.08808333226186!2d73.92578121238903!3f160!4f0!5f0.7820865974627469"
    },
    {
      id: 2,
      title: "Doctor OPD",
      description: "Our consultation rooms where expert doctors provide personalized care",
      src: "https://www.google.com/maps/embed?pb=!4v1755603887121!6m8!1m7!1sCAoSLEFGMVFpcE8tUVZNdjkyMWx5dGg3NFk5MFRfZmxmQkNHajNaUHg2WHY3S2Rs!2m2!1d20.0880556!2d73.92577779999999!3f180!4f0!5f0.7820865974627469"
    },
    {
      id: 3,
      title: "Panchkarma Treatment Room",
      description: "Specialized Panchkarma therapy rooms for traditional Ayurvedic treatments",
      src: "https://www.google.com/maps/embed?pb=!4v1755603942122!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQy1nYWZQemdF!2m2!1d20.08805472862637!2d73.9257507141403!3f32.06300965534071!4f8.97334379211847!5f0.4000000000000002"
    },
    {
      id: 4,
      title: "Shirodhara Treatment",
      description: "Traditional Shirodhara therapy room for stress relief and mental wellness",
      src: "https://www.google.com/maps/embed?pb=!4v1755604066320!6m8!1m7!1sCAoSLEFGMVFpcFA2MTB5WWM0Y1FkcWZxdWpGaWdCUExDU1NCcjJCN3drQzlnbHJZ!2m2!1d20.0880278!2d73.9258333!3f52.18355274200996!4f-3.3441958255876045!5f0.7820865974627469"
    }
  ];

  const openModal = (view: View) => {
    setCurrentView(view);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentView(null);
  };

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">
              Take a Virtual Tour
            </h2>
            <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
              Experience our hospital facilities through interactive 360° virtual tours. 
              Get a glimpse of our treatment rooms and therapeutic spaces.
            </p>
          </div>

          {/* 2x2 Grid Layout for Homepage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
            {views.map((view) => (
              <div key={view.id} className="relative group">
                <Card className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <iframe
                      src={view.src}
                      className="w-full h-80 object-cover"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={view.title}
                    ></iframe>
                    
                    {/* Overlay */}
                    <div
                      onClick={() => openModal(view)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <div className="text-white text-center">
                        <div className="bg-white bg-opacity-20 rounded-full p-3 mb-2">
                          <Eye className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold">View in 360°</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                      {view.title}
                    </h3>
                    <p className="text-emerald-600 text-sm">
                      {view.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

                     {/* View More Button */}
           <div className="text-center mb-12">
             <Link href="/gallery">
               <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full group transition-all duration-300 hover:scale-105">
                 <span className="mr-2">View All Virtual Tours</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
               </Button>
             </Link>
           </div>

           {/* Consultation CTA Section */}
           <div className="bg-emerald-800 text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
             <h3 className="text-2xl md:text-3xl font-bold mb-4">
               Not sure which treatment is right for you?
             </h3>
             <p className="text-emerald-100 text-lg mb-6 max-w-2xl mx-auto">
               Book a consultation with our experienced Ayurvedic physicians to get a personalized treatment plan based on your unique health needs and constitution.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Link href="/book-appointment">
                 <Button className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
                   Book Consultation
                 </Button>
               </Link>
             
               <div className="flex items-center gap-2">
                 <span className="text-emerald-100 text-sm">Or chat with us:</span>
                 <SocialIcon 
                   url="https://wa.me/9921118724" 
                   network="whatsapp"
                   bgColor="transparent"
                   fgColor="#ffffff"
                   style={{ width: 40, height: 40 }}
                   target="_blank"
                   rel="noopener noreferrer"
                 />
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Modal for Enlarged 360° View */}
      {isModalOpen && currentView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          role="dialog"
          aria-labelledby="modal-title"
          aria-hidden={!isModalOpen}
        >
          <div className="relative bg-white p-1 rounded-md mx-auto max-w-5xl w-full mx-4">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-t-md z-10">
              <h2 id="modal-title" className="text-lg font-semibold">
                {currentView.title}
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                {currentView.description}
              </p>
            </div>

            {/* Close Button */}
            <div className="absolute top-0 right-0 p-4 z-20">
              <Button
                variant="outline"
                size="icon"
                className="text-white bg-black bg-opacity-50 rounded-full p-2 text-xl hover:bg-opacity-70 transition-all duration-200 border-white/20"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <iframe
              src={currentView.src}
              className="w-full h-[400px] lg:h-[600px] rounded-lg"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Enlarged ${currentView.title}`}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTourPreview;
