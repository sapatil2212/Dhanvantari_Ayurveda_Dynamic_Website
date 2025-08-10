import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import AppointmentModal from '@/components/ui/AppointmentModal';
import ClientChrome from './ui/ClientChrome';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dhanvantari Ayurvedic Clinic & Panchkarma Centre | Nashik',
  description: 'Experience authentic Ayurvedic healing at Dhanvantari Ayurvedic Clinic in Saikheda Phata, Ojhar, Maharashtra. Specializing in Panchkarma treatments, chronic pain management, and holistic wellness.',
  keywords: 'Ayurveda, Panchkarma, Nashik, Ayurvedic treatment, holistic healing, chronic pain, wellness center',
  authors: [{ name: 'Dhanvantari Ayurvedic Clinic' }],
  openGraph: {
    title: 'Dhanvantari Ayurvedic Clinic & Panchkarma Centre',
    description: 'Authentic Ayurvedic healing and Panchkarma treatments in Nashik',
    url: 'http://dhanvantariayurved.in',
    siteName: 'Dhanvantari Ayurvedic Clinic',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AppointmentProvider>
            {/* Hide header/footer on dashboard via client wrapper */}
            <ClientChrome>
              <Navigation />
            </ClientChrome>
            <main className="min-h-screen">{children}</main>
            <ClientChrome>
              <Footer />
              <WhatsAppFloat />
            </ClientChrome>
            <AppointmentModal />
            <Toaster />
          </AppointmentProvider>
        </Providers>
      </body>
    </html>
  );
}