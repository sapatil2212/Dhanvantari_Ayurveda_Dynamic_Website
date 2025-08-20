import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap - Dhanvantari Ayurvedic Clinic',
  description: 'Complete sitemap of Dhanvantari Ayurvedic Clinic website - find all pages and sections easily.',
};

export default function SitemapPage() {
  const mainPages = [
    { name: 'Home', href: '/', description: 'Welcome to Dhanvantari Ayurvedic Clinic' },
    { name: 'About Us', href: '/about', description: 'Learn about our clinic and mission' },
    { name: 'Services', href: '/services', description: 'Our Ayurvedic treatments and therapies' },
    { name: 'Conditions We Treat', href: '/conditions', description: 'Health conditions we specialize in' },
    { name: 'Book Appointment', href: '/book-appointment', description: 'Schedule your consultation' },
    { name: 'Contact', href: '/contact', description: 'Get in touch with us' },
    { name: 'Gallery', href: '/gallery', description: 'View our clinic and treatments' },
    { name: 'Testimonials', href: '/testimonials', description: 'Patient reviews and experiences' },
    { name: 'Blog', href: '/blog', description: 'Health and wellness articles' },
  ];

  const treatmentPages = [
    { name: 'Panchkarma', href: '/treatments/panchkarma', description: 'Traditional Panchkarma therapies' },
    { name: 'Hair & Skin Care', href: '/treatments/hair-skin-care', description: 'Ayurvedic beauty treatments' },
    { name: 'Infertility Treatment', href: '/treatments/infertility-treatment', description: 'Natural fertility solutions' },
    { name: 'Kerala Beauty', href: '/treatments/kerala-beauty', description: 'Kerala-style beauty therapies' },
    { name: 'Memory & Immunity', href: '/treatments/memory-immunity', description: 'Brain health and immunity boosters' },
    { name: 'Menstrual Disorders', href: '/treatments/menstrual-disorders', description: 'Women\'s health solutions' },
    { name: 'Pregnancy Care', href: '/treatments/pregnancy-care', description: 'Maternal wellness programs' },
    { name: 'Seasonal Therapies', href: '/treatments/seasonal-therapies', description: 'Season-specific treatments' },
    { name: 'Weakness Remedies', href: '/treatments/weakness-remedies', description: 'Energy and strength building' },
    { name: 'Weight Management', href: '/treatments/weight-management', description: 'Natural weight loss solutions' },
  ];

  const legalPages = [
    { name: 'Privacy Policy', href: '/privacy', description: 'How we protect your privacy' },
    { name: 'Terms of Service', href: '/terms', description: 'Terms and conditions of use' },
  ];

  const authPages = [
    { name: 'Login', href: '/auth/login', description: 'Access your account' },
    { name: 'Register', href: '/auth/register', description: 'Create a new account' },
    { name: 'Forgot Password', href: '/auth/forgot-password', description: 'Reset your password' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto py-12 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Navigate through all pages and sections of Dhanvantari Ayurvedic Clinic website
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Main Pages</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <h3 className="font-semibold text-lg text-emerald-700 group-hover:text-emerald-600 transition-colors mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Treatment Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Treatments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatmentPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <h3 className="font-semibold text-lg text-emerald-700 group-hover:text-emerald-600 transition-colors mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Legal Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Legal & Policy</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {legalPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <h3 className="font-semibold text-lg text-emerald-700 group-hover:text-emerald-600 transition-colors mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Authentication Pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Management</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {authPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <h3 className="font-semibold text-lg text-emerald-700 group-hover:text-emerald-600 transition-colors mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Contact</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+91 99211 18724</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">dhanvantariayurvedansk@gmail.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    Dhanvantari Ayurveda Building<br />
                    Saikheda Phata, near Khanderao mandir<br />
                    Ojhar, Maharashtra 422206
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Site Structure Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Site Structure Overview</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Website Sections</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Public Pages</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Homepage with hero section and services overview</li>
                        <li>• About us with clinic information and team</li>
                        <li>• Services page with detailed treatment descriptions</li>
                        <li>• Individual treatment pages for each therapy</li>
                        <li>• Patient testimonials and reviews</li>
                        <li>• Photo gallery of clinic and treatments</li>
                        <li>• Health blog with wellness articles</li>
                        <li>• Contact information and location details</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">User Features</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Online appointment booking system</li>
                        <li>• User registration and login</li>
                        <li>• Patient dashboard and medical records</li>
                        <li>• Prescription sharing and viewing</li>
                        <li>• Payment processing and invoicing</li>
                        <li>• Notification system for appointments</li>
                        <li>• Privacy policy and terms of service</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Key Features</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Healthcare</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Patient management system</li>
                        <li>• Medical history tracking</li>
                        <li>• Treatment planning</li>
                        <li>• Prescription management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Administrative</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Appointment scheduling</li>
                        <li>• Inventory management</li>
                        <li>• Billing and invoicing</li>
                        <li>• Staff management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Communication</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Email notifications</li>
                        <li>• SMS reminders</li>
                        <li>• Patient portal</li>
                        <li>• Contact forms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
