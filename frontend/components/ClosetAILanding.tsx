"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MotionDiv: React.ComponentType<any> = motion.div as unknown as React.ComponentType<any>;
import Link from 'next/link'
import { Sparkles, Shirt, Heart, Zap, Star } from 'lucide-react';
import Footer2 from './Footer2';
import PricingSection from './PricingSection';
import LoadingScreen from './LoadingScreen';
import Hero3D from './Hero3D';

export default function ClosetAILanding() {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* 3D-style Hero Section */}
      <Hero3D />

      {/* Redesigned Landing Sections (features, how-it-works, testimonials, pricing, CTA) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <MotionDiv className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-space-grotesk">Why ClosetAI</h3>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">A smarter wardrobe, better outfits — fast. We combine your wardrobe data with AI to deliver outfit suggestions you’ll actually wear.</p>
          </MotionDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <MotionDiv className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="text-4xl text-blue-600 mb-4"><Shirt /></div>
              <h4 className="text-lg font-semibold mb-2">Organize Your Closet</h4>
              <p className="text-sm text-gray-600">Smart tagging and search make it easy to find and reuse your favorite pieces.</p>
            </MotionDiv>

            <MotionDiv className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="text-4xl text-purple-600 mb-4"><Sparkles /></div>
              <h4 className="text-lg font-semibold mb-2">AI Outfit Generator</h4>
              <p className="text-sm text-gray-600">Personalized looks for any occasion — day-to-day, work, or nights out.</p>
            </MotionDiv>

            <MotionDiv className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="text-4xl text-pink-600 mb-4"><Heart /></div>
              <h4 className="text-lg font-semibold mb-2">Learns With You</h4>
              <p className="text-sm text-gray-600">Give feedback and the AI adapts to better match your taste over time.</p>
            </MotionDiv>
          </div>
          {/* Wardrobe previews: non-clickable screenshot-like previews */}
          <MotionDiv className="mt-10">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Peek inside your closet</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 pointer-events-none">
                <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm grid grid-cols-3 gap-2 bg-white p-2">
                  <img src="/images/dress 1.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                  <img src="/images/dress 2.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                  <img src="/images/dress 3.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                  <img src="/images/dress 2.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                  <img src="/images/dress 3.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                  <img src="/images/dress 1.jpg" alt="item" className="object-cover w-full h-20 rounded-md col-span-1" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Wardrobe Grid (Preview)</div>
                  <div className="text-xs text-gray-500">A visual snapshot of your uploaded items — preview only, not interactive.</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 pointer-events-none">
                <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm bg-white flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <img src="/images/dress 1.jpg" alt="outfit" className="object-cover w-full h-full rounded-lg shadow-lg" />
                    <div className="absolute -top-2 -right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold border border-gray-100">AI</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Outfit Card (Preview)</div>
                  <div className="text-xs text-gray-500">Mock of an AI outfit suggestion showing combined items and a recommendation badge.</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 pointer-events-none">
                <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm p-3 bg-white flex">
                  <img src="/images/dress 2.jpg" alt="item" className="w-36 h-full object-cover rounded-md mr-3" />
                  <div className="flex-1 py-1">
                    <div className="text-sm font-semibold">Black Dress</div>
                    <div className="text-xs text-gray-500 mb-2">Category: Dress • Color: Black</div>
                    <div className="text-xs text-gray-600">AI Notes: Perfect for evening events — pair with heels and a clutch.</div>
                    <div className="mt-3 flex gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Formal</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Size: M</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">Item Detail (Preview)</div>
                  <div className="text-xs text-gray-500">Preview of an item detail panel — shows metadata and AI suggestions (non-interactive).</div>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <MotionDiv className="text-center mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How it works — in 3 steps</h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">A simple flow to get outfit suggestions fast.</p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MotionDiv className="bg-white rounded-2xl p-6 text-center border border-gray-100" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-4">1</div>
              <h4 className="font-semibold mb-2">Upload</h4>
              <p className="text-sm text-gray-600">Snap or import your clothes to build your digital wardrobe.</p>
            </MotionDiv>

            <MotionDiv className="bg-white rounded-2xl p-6 text-center border border-gray-100" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mx-auto w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold mb-4">2</div>
              <h4 className="font-semibold mb-2">Analyze</h4>
              <p className="text-sm text-gray-600">Our AI analyzes colors, fits and occasions to understand your style.</p>
            </MotionDiv>

            <MotionDiv className="bg-white rounded-2xl p-6 text-center border border-gray-100" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mx-auto w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold mb-4">3</div>
              <h4 className="font-semibold mb-2">Wear</h4>
              <p className="text-sm text-gray-600">Get outfit suggestions and tips — daily or on demand.</p>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <MotionDiv initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Illustrative Feedback — Examples Only</h3>
            <p className="text-sm text-gray-600 mb-8">Below are example reactions and scenario snapshots to show how ClosetAI can help — these are illustrative mockups and not real user reviews.</p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MotionDiv className="relative p-6 rounded-3xl bg-gradient-to-tr from-indigo-50 to-white border border-indigo-100 shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">👩</div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Sample Persona — Busy Professional</div>
                  <div className="text-xs text-indigo-700 mt-1">Example</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-700">"I get quick outfit suggestions that match my work calendar — saves me time every morning."</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-indigo-100 rounded">Work-friendly</span>
                <span className="px-2 py-1 bg-indigo-100 rounded">Minimalist</span>
              </div>
            </MotionDiv>

            <MotionDiv className="relative p-6 rounded-3xl bg-gradient-to-tr from-pink-50 to-white border border-pink-100 shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-pink-100 opacity-40 blur-3xl" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">🎨</div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Sample Persona — Casual Explorer</div>
                  <div className="text-xs text-pink-700 mt-1">Example</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-700">"The outfits feel like me — I love seeing fresh combos from pieces I already own."</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-pink-100 rounded">Everyday</span>
                <span className="px-2 py-1 bg-pink-100 rounded">Personalized</span>
              </div>
            </MotionDiv>

            <MotionDiv className="relative p-6 rounded-3xl bg-gradient-to-tr from-yellow-50 to-white border border-yellow-100 shadow-lg" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-yellow-100 opacity-40 blur-3xl" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">⭐</div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Sample Persona — Occasional Glam</div>
                  <div className="text-xs text-yellow-700 mt-1">Example</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-700">"Found a standout outfit for an event I almost skipped — got compliments all night."</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-yellow-100 rounded">Event Ready</span>
                <span className="px-2 py-1 bg-yellow-100 rounded">Confidence</span>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <MotionDiv initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h3 className="text-3xl font-bold text-white mb-4">Ready to transform your wardrobe?</h3>
            <p className="text-lg text-blue-100 mb-6">Start a free trial and see outfit recommendations tailored to you.</p>
            <Link href="/register" className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 shadow">Get started <Zap className="ml-2 w-5 h-5" /></Link>
          </MotionDiv>
        </div>
      </section>

      <Footer2 />
    </div>
  );
}
