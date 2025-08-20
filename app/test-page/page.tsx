import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Page',
  description: 'Test page to check server component functionality',
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-lg text-gray-600">This is a simple test page to check server component functionality.</p>
      </div>
    </div>
  );
}
