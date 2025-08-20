import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Dhanvantari Ayurvedic Clinic',
  description: 'Learn how we protect your privacy and handle your personal information at Dhanvantari Ayurvedic Clinic.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto py-12 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Dhanvantari Ayurvedic Clinic, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, contact details (phone, email, address)</li>
                  <li>Date of birth and gender</li>
                  <li>Medical history and health information</li>
                  <li>Appointment preferences and treatment records</li>
                  <li>Payment and billing information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide personalized Ayurvedic treatments and consultations</li>
                <li>To schedule and manage appointments</li>
                <li>To maintain accurate medical records</li>
                <li>To process payments and send invoices</li>
                <li>To communicate important health information</li>
                <li>To improve our services and website experience</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Information Sharing</h2>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With your consent:</strong> When you explicitly authorize us to share your information</li>
                <li><strong>Medical professionals:</strong> With other healthcare providers involved in your treatment</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Service providers:</strong> With trusted partners who help us operate our business (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Security</h2>
            <div className="space-y-4 text-gray-700">
              <p>We implement comprehensive security measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure servers and regular security audits</li>
                <li>Access controls and authentication measures</li>
                <li>Regular staff training on data protection</li>
                <li>Compliance with healthcare data protection standards</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another provider</li>
                <li><strong>Restriction:</strong> Request limitation of how we use your information</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-700">
              <p>We use cookies and similar technologies to enhance your browsing experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mt-4">You can control cookie settings through your browser preferences.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <div className="bg-emerald-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> dhanvantariayurvedansk@gmail.com</p>
                <p><strong>Phone:</strong> +91 99211 18724</p>
                <p><strong>Address:</strong> Dhanvantari Ayurveda Building, Saikheda Phata, near Khanderao mandir, Ojhar, Maharashtra 422206</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Updates to This Policy</h2>
            <div className="text-gray-700">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
