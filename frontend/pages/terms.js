import React from 'react'
import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: February 17, 2026</p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 text-gray-700">By accessing or using this service you agree to be bound by these Terms of Service. Please do not use the service if you do not agree to these terms.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">2. Changes to Terms</h2>
          <p className="mt-2 text-gray-700">We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">3. Use of the Service</h2>
          <p className="mt-2 text-gray-700">You agree to use the service only for lawful purposes and in compliance with all applicable laws and regulations.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">4. User Content</h2>
          <p className="mt-2 text-gray-700">You retain ownership of content you submit. By submitting content you grant the service a license to store and use it as necessary to provide the service.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
          <p className="mt-2 text-gray-700">All service-owned content, marks, and software are our property or licensed to us. You may not copy or reuse our proprietary material without permission.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">6. Disclaimers</h2>
          <p className="mt-2 text-gray-700">The service is provided "as is" and we disclaim warranties to the fullest extent permitted by law.</p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p className="mt-2 text-gray-700">We are not liable for indirect, incidental, or consequential damages arising from use of the service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p className="mt-2 text-gray-700">These Terms are governed by the laws of the jurisdiction where the service operator is based.</p>
        </section>

        <div className="flex justify-between items-center border-t pt-4">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
