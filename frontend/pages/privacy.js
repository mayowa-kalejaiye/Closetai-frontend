import React from 'react'
import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: February 17, 2026</p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="mt-2 text-gray-700">We collect information you provide directly (e.g., account details, profile pictures) and usage data needed to operate and improve the service.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">2. How We Use Information</h2>
          <p className="mt-2 text-gray-700">We use collected data to provide, maintain, and improve the service, and to communicate with you about your account.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">3. Cookies and Tracking</h2>
          <p className="mt-2 text-gray-700">We may use cookies and similar technologies to provide and analyze our service. You can control cookies through your browser settings.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
          <p className="mt-2 text-gray-700">We may share data with third-party service providers who perform services on our behalf. Those providers are bound by confidentiality obligations.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p className="mt-2 text-gray-700">We take reasonable measures to protect data, but cannot guarantee absolute security. Please avoid sharing highly sensitive personal information.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">6. Children's Privacy</h2>
          <p className="mt-2 text-gray-700">The service is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
          <p className="mt-2 text-gray-700">We may update this policy. Continued use after changes constitutes acceptance of the updated policy.</p>
        </section>

        <div className="flex justify-between items-center border-t pt-4">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
