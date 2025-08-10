"use client";

import { useState } from 'react';
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
    name: 'Services', 
    href: '/services',
    submenu: [
      { name: 'Panchkarma', href: '/services#panchkarma' },
      { name: 'Consultations', href: '/services#consultations' },
      { name: 'Specialized Treatments', href: '/services#specialized' }
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
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
                          <ul className="w-48 p-2">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.name}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
                                  >
                                    {subItem.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
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
                                  <div className="flex items-center space-x-2 pb-4 border-b">
                  <Image 
                    src="/assets/logo/logo.png"
                    alt="Dhanvantari Ayurvedic Clinic"
                    width={100}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                </div>

                  {navigation.map((item) => (
                    <div key={item.name}>
                      {item.submenu ? (
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="pl-4 space-y-2">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block py-2 text-sm text-gray-600 hover:text-emerald-600"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.name}
                              </Link>
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