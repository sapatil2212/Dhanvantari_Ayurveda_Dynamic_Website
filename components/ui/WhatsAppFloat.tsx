'use client';

import { SocialIcon } from 'react-social-icons';
import { Phone } from 'lucide-react';

export default function WhatsAppFloat() {

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Icon */}
      <div className="group">
        <SocialIcon 
          url="https://wa.me/9921118724?text=Hello! I would like to know more about your Ayurvedic treatments."
          network="whatsapp"
          bgColor="#25D366"
          fgColor="#ffffff"
          style={{ width: 48, height: 48 }}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-300 hover:scale-110"
        />
        <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </div>

      {/* Call Icon */}
      <div className="group">
        <button
          onClick={() => window.open('tel:+919921118724', '_self')}
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Call us"
        >
          <Phone className="w-5 h-5" />
        </button>
        <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Call us
        </span>
      </div>
    </div>
  );
}