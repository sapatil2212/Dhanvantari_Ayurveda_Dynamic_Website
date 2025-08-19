'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Watch Our Story
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6 leading-tight">
            Discover Our Healing Journey
          </h2>
          <p className="text-emerald-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Learn about our commitment to holistic wellness and how we've been transforming lives through traditional Ayurvedic practices.
          </p>
        </div>

                 <div className="max-w-4xl mx-auto">
           {/* Video Container */}
           <Card className="overflow-hidden shadow-xl border-emerald-200">
             <div className="relative aspect-video bg-emerald-900">
               <iframe 
                 width="100%" 
                 height="100%" 
                 src="https://www.youtube.com/embed/B0LnZqR8aiE?si=eej_9YKOunVXhVBz" 
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 referrerPolicy="strict-origin-when-cross-origin" 
                 allowFullScreen
                 className="absolute inset-0 w-full h-full"
               ></iframe>
             </div>
           </Card>
         </div>

        
      </div>
    </section>
  );
};

export default VideoSection;
