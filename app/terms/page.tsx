import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Dhanvantari Ayurvedic Clinic',
  description: 'Read our terms of service and conditions for using Dhanvantari Ayurvedic Clinic services.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto py-12 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services at Dhanvantari Ayurvedic Clinic.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Acceptance of Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acceptance of Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                By accessing and using the services of Dhanvantari Ayurvedic Clinic, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
              </p>
              <p>
                These terms apply to all visitors, users, and patients who access or use our website, services, and facilities.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Services Description</h2>
            <div className="space-y-4 text-gray-700">
              <p>Dhanvantari Ayurvedic Clinic provides the following services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ayurvedic consultations and treatments</li>
                <li>Panchkarma therapies and procedures</li>
                <li>Wellness and lifestyle counseling</li>
                <li>Herbal medicine prescriptions</li>
                <li>Online appointment booking</li>
                <li>Health information and educational content</li>
              </ul>
              <p className="mt-4">
                All services are provided by qualified Ayurvedic practitioners and healthcare professionals.
              </p>
            </div>
          </section>

          {/* Medical Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Medical Disclaimer</h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p className="font-semibold text-amber-800 mb-2">Important Medical Information:</p>
                <ul className="list-disc list-inside space-y-2 text-amber-700">
                  <li>Our services are not a substitute for emergency medical care</li>
                  <li>Always consult with your primary healthcare provider before starting any new treatment</li>
                  <li>Results may vary and are not guaranteed</li>
                  <li>If you experience severe symptoms, seek immediate medical attention</li>
                  <li>We reserve the right to refuse service if we believe it may be harmful to your health</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Appointment and Cancellation Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Appointment and Cancellation Policy</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">Booking Appointments</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Appointments can be booked online, by phone, or in person</li>
                  <li>Please arrive 10-15 minutes before your scheduled appointment time</li>
                  <li>Bring any relevant medical records or test results</li>
                  <li>Inform us of any changes in your health condition</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>24-hour notice is required for appointment cancellations</li>
                  <li>Late cancellations or no-shows may incur a fee</li>
                  <li>Emergency cancellations will be handled on a case-by-case basis</li>
                  <li>We reserve the right to reschedule appointments due to practitioner availability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Terms</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Methods</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cash payments accepted at the clinic</li>
                  <li>Online payments through secure payment gateways</li>
                  <li>Bank transfers (advance payment required)</li>
                  <li>Insurance coverage may be available for certain treatments</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Pricing and Refunds</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All prices are subject to change without prior notice</li>
                  <li>Treatment packages must be paid in full before commencement</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>Partial refunds may be available for incomplete treatment packages</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Confidentiality */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Privacy and Confidentiality</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We are committed to maintaining the privacy and confidentiality of your personal and medical information. Our privacy practices are detailed in our Privacy Policy, which is incorporated into these terms by reference.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All medical records are kept strictly confidential</li>
                <li>Information is shared only with your explicit consent</li>
                <li>We comply with all applicable healthcare privacy laws</li>
                <li>Staff members are bound by confidentiality agreements</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">User Responsibilities</h2>
            <div className="space-y-4 text-gray-700">
              <p>As a user of our services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information about your health</li>
                <li>Follow the treatment plans and recommendations provided</li>
                <li>Inform us of any adverse reactions or side effects</li>
                <li>Respect the clinic's rules and regulations</li>
                <li>Treat staff and other patients with courtesy and respect</li>
                <li>Not misuse our website or services</li>
                <li>Maintain the confidentiality of your account information</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Intellectual Property</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                All content on our website, including text, images, graphics, and logos, is the property of Dhanvantari Ayurvedic Clinic and is protected by copyright laws. You may not reproduce, distribute, or use this content without our written permission.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Dhanvantari Ayurvedic Clinic shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific service in question.
              </p>
              <p>
                This limitation does not apply to damages caused by our gross negligence or intentional misconduct.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Termination</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to terminate or suspend your access to our services at any time, with or without cause, with or without notice. You may also terminate your relationship with us at any time by discontinuing use of our services.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Governing Law</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Nashik, Maharashtra.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Changes to Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <div className="bg-emerald-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> dhanvantariayurvedansk@gmail.com</p>
                <p><strong>Phone:</strong> +91 99211 18724</p>
                <p><strong>Address:</strong> Dhanvantari Ayurveda Building, Saikheda Phata, near Khanderao mandir, Ojhar, Maharashtra 422206</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
