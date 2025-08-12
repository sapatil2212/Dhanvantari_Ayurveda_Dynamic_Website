"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Leaf, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useAppointment } from '@/contexts/AppointmentContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { 
    name: 'Treatments', 
    href: '/services',
    submenu: [
      { name: 'Panchkarma', href: '/services#panchkarma' },
      { name: 'Seasonal Ayurvedic Therapies', href: '/services#seasonal-therapies' },
      { name: 'Kerala Beauty Therapies', href: '/services#kerala-beauty' },
      { name: 'Weight Management Solutions', href: '/services#weight-management' },
      { name: 'Memory & Immunity Boosting Therapies', href: '/services#memory-immunity' },
      { name: 'Infertility (Uttarbasti) Treatment', href: '/services#infertility-treatment' },
      { name: 'Hair Fall, Premature Greying & Skin Care', href: '/services#hair-skin-care' },
      { name: 'Garbhsanskar – Healthy Pregnancy Care', href: '/services#pregnancy-care' },
      { name: 'Menstrual Disorder Treatments', href: '/services#menstrual-disorders' },
      { name: 'Physical & Mental Weakness Remedies', href: '/services#weakness-remedies' }
    ]
  },
  { name: 'Conditions', href: '/conditions' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
];

export default function Navigation() {
  const { setIsAppointmentModalOpen } = useAppointment();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Function to get treatment descriptions
  const getTreatmentDescription = (treatmentName: string) => {
    const descriptions: { [key: string]: string } = {
      'Panchkarma': 'Traditional detoxification therapies',
      'Seasonal Ayurvedic Therapies': 'Season-specific wellness treatments',
      'Kerala Beauty Therapies': 'Natural beauty and rejuvenation',
      'Weight Management Solutions': 'Holistic weight loss programs',
      'Memory & Immunity Boosting Therapies': 'Cognitive and immune enhancement',
      'Infertility (Uttarbasti) Treatment': 'Reproductive health solutions',
      'Hair Fall, Premature Greying & Skin Care': 'Natural hair and skin treatments',
      'Garbhsanskar – Healthy Pregnancy Care': 'Prenatal wellness programs',
      'Menstrual Disorder Treatments': 'Hormonal balance therapies',
      'Physical & Mental Weakness Remedies': 'Strength and vitality restoration'
    };
    return descriptions[treatmentName] || 'Ayurvedic wellness treatment';
  };

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60' 
        : 'bg-white'
    }`}>
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/assets/logo/logo.png"
              alt="Dhanvantari Ayurvedic Clinic"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-emerald-50 text-gray-700 hover:text-emerald-700">
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[600px] p-3 bg-white rounded-lg shadow-lg">
                            <div className="grid grid-cols-2 gap-2">
                              {item.submenu.map((subItem, index) => (
                                <div key={subItem.name} className="group">
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={subItem.href}
                                      className="block p-2 rounded-md hover:bg-emerald-50 transition-all duration-200"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-sm text-gray-700 group-hover:text-emerald-700 transition-colors">
                                          {subItem.name}
                                        </span>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                  {/* Add faint line partitions between items */}
                                  {index % 2 === 1 && index < item.submenu.length - 1 && (
                                    <div className="h-px bg-gray-100 mt-2"></div>
                                  )}
                                  {index % 2 === 0 && index < item.submenu.length - 2 && (
                                    <div className="h-px bg-gray-100 mt-2"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+919921118724"
              className="hidden md:flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 99211 18724</span>
            </a>
            
            <Button 
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Book Appointment
            </Button>

            {session ? (
              <Link href="/dashboard" className="hidden md:inline text-sm font-medium text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden md:inline text-sm font-medium text-gray-700 hover:text-gray-900">
                Login
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">

                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.submenu ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setExpandedSubmenu(expandedSubmenu === item.name ? null : item.name)}
                            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900 text-base hover:text-emerald-600 transition-colors"
                          >
                            {item.name}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                              expandedSubmenu === item.name ? 'rotate-180' : ''
                            }`} />
                          </button>
                          <div className={`pl-4 space-y-1 ${expandedSubmenu === item.name ? 'block' : 'hidden'}`}>
                            {item.submenu.map((subItem, index) => (
                              <div key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block py-2 px-3 rounded-md hover:bg-emerald-50 transition-all duration-200"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">
                                      {subItem.name}
                                    </span>
                                  </div>
                                </Link>
                                {/* Add faint line partitions between items */}
                                {index < item.submenu.length - 1 && (
                                  <div className="h-px bg-gray-100 mt-1 ml-3"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block py-2 text-sm font-medium ${
                            isActive(item.href)
                              ? 'text-emerald-600'
                              : 'text-gray-900 hover:text-emerald-600'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t space-y-4">
                    <a
                      href="tel:+919921118724"
                      className="flex items-center space-x-2 text-emerald-600"
                    >
                      <Phone className="w-4 h-4" />
                      <span>+91 99211 18724</span>
                    </a>
                    
                    <Button 
                      onClick={() => {
                        setIsAppointmentModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Book Appointment
                    </Button>

                    {session ? (
                      <Link
                        href="/dashboard"
                        className="block w-full text-center py-2 text-sm font-medium text-gray-900 hover:text-emerald-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="block w-full text-center py-2 text-sm font-medium text-gray-900 hover:text-emerald-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}