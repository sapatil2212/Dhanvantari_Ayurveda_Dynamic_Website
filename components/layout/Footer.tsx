'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useHotelInfo } from '@/hooks/use-hotel-info';

export default function Footer() {
  const { setIsAppointmentModalOpen } = useAppointment();
  const { hotelInfo } = useHotelInfo();
  return (
    <footer className="bg-emerald-800 text-white">
      <div className="container mx-auto py-12 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white rounded-lg p-3">
                <Image
                  src={hotelInfo?.footerLogo || "/assets/logo/logo.png"}
                  alt={hotelInfo?.name || "Dhanvantari Ayurvedic Clinic"}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              </div>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed mb-4">
              {hotelInfo?.description || "Authentic Ayurvedic healing through traditional Panchkarma treatments and personalized wellness solutions in the heart of Nashik."}
            </p>
                          <div className="flex space-x-3">
                {hotelInfo?.facebook && (
                  <SocialIcon 
                    url={hotelInfo.facebook}
                    network="facebook"
                    bgColor="#1877F2"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
                {hotelInfo?.instagram && (
                  <SocialIcon 
                    url={hotelInfo.instagram}
                    network="instagram"
                    bgColor="#E4405F"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
                {hotelInfo?.twitter && (
                  <SocialIcon 
                    url={hotelInfo.twitter}
                    network="x"
                    bgColor="#000000"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
                {hotelInfo?.linkedin && (
                  <SocialIcon 
                    url={hotelInfo.linkedin}
                    network="linkedin"
                    bgColor="#0A66C2"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
                {hotelInfo?.pinterest && (
                  <SocialIcon 
                    url={hotelInfo.pinterest}
                    network="pinterest"
                    bgColor="#BD081C"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
                {hotelInfo?.youtube && (
                  <SocialIcon 
                    url={hotelInfo.youtube}
                    network="youtube"
                    bgColor="#FF0000"
                    fgColor="#ffffff"
                    style={{ width: 32, height: 32 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:scale-110"
                  />
                )}
              </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-emerald-200">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Our Treatments</Link></li>
              <li><Link href="/conditions" className="hover:text-white transition-colors">Conditions We Treat</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Patient Reviews</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Health Blog</Link></li>
              <li><button onClick={() => setIsAppointmentModalOpen(true)} className="hover:text-white transition-colors text-left">Book Appointment</button></li>
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Our Treatments</h3>
            <ul className="space-y-2 text-emerald-200">
              <li><Link href="/services#vaman" className="hover:text-white transition-colors">Vaman Therapy</Link></li>
              <li><Link href="/services#virechan" className="hover:text-white transition-colors">Virechan Therapy</Link></li>
              <li><Link href="/services#basti" className="hover:text-white transition-colors">Basti Treatment</Link></li>
              <li><Link href="/services#nasya" className="hover:text-white transition-colors">Nasya Therapy</Link></li>
              <li><Link href="/services#abhyanga" className="hover:text-white transition-colors">Abhyanga Massage</Link></li>
              <li><Link href="/services#shirodhara" className="hover:text-white transition-colors">Shirodhara</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3 text-emerald-200">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{hotelInfo?.address || "Dhanvantari Ayurveda Building"}</div>
                  <div>{hotelInfo?.landmark || "Saikheda Phata, near Khanderao mandir"}</div>
                  <div>{hotelInfo?.city || "Ojhar"}, {hotelInfo?.state || "Maharashtra"} {hotelInfo?.pincode || "422206"}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <div>{hotelInfo?.phone || "+91 99211 18724"}</div>
                  {hotelInfo?.emergencyContact && (
                    <div className="text-emerald-300">Emergency: {hotelInfo.emergencyContact}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  {hotelInfo?.email || "dhanvantariayurvedansk@gmail.com"}
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  {hotelInfo?.workingHours ? (
                    hotelInfo.workingHours.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))
                  ) : (
                    <>
                      <div>Mon - Sat: 9:00 AM - 7:00 PM</div>
                      <div>Sunday: 10:00 AM - 2:00 PM</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-emerald-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-emerald-200 text-sm">
              © {new Date().getFullYear()} {hotelInfo?.name || "Dhanvantari Ayurvedic Clinic"}. All rights reserved.
            </div>
            <div className="flex space-x-6 text-emerald-200 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}