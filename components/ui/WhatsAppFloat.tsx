'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '919921118724'; // Replace with actual WhatsApp number
    const message = 'Hello! I would like to know more about your Ayurvedic treatments.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-16 bg-green-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Chat on WhatsApp
      </span>
    </button>
  );
}