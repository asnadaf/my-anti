import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Welcome to AntiVirus Solutions</title>
        <meta name="description" content="Your trusted source for antivirus solutions" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Protect Your Digital Life</span>
            <span className="block text-blue-600">with Premium Antivirus Solutions</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Secure your devices with industry-leading antivirus protection. Stay safe from malware, ransomware, and cyber threats.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/buyantivirus" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Browse Antivirus Solutions
            </Link>
            <Link href="/search" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Search Products
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Real-time Protection</h3>
              <p className="mt-2 text-gray-500">
                Get instant protection against emerging threats with our real-time scanning technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Multi-device Security</h3>
              <p className="mt-2 text-gray-500">
                Protect all your devices with a single subscription - PC, Mac, mobile, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">24/7 Support</h3>
              <p className="mt-2 text-gray-500">
                Our expert team is always available to help you with any security concerns.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}