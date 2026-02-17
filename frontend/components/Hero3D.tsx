"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero3D() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200 mb-4">
            <span className="text-2xl font-bold text-gray-800 font-dancing-script">C</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-space-grotesk">
            Your AI Fashion
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Stylist</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Upload your wardrobe and get personalized outfit recommendations — styled for your life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              Start Your Style Journey
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute inset-0 transform-gpu animate-rotate-3d">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-200 flex items-center justify-center overflow-visible" style={{ perspective: 1200, WebkitPerspective: 1200, transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}>
                <div className="relative w-56 h-72" style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d', willChange: 'transform' }}>
                  {/* Background stacked mockups (behind) */}
                  <img
                    src="/images/dress 3.jpg"
                    alt="Dress mockup back 1"
                    className="absolute object-cover rounded-xl transform-gpu border ring-2 ring-white"
                    style={{ left: '14%', top: '8%', width: '74%', height: '74%', transform: 'rotate(350deg) scale(1.2)', opacity: 0.88, zIndex: 12, boxShadow: '0 22px 44px rgba(0,0,0,0.14)' }}
                    loading="lazy"
                  />
                  <img
                    src="/images/dress 2.jpg"
                    alt="Dress mockup back 2"
                    className="absolute object-cover rounded-xl transform-gpu border ring-2 ring-white"
                    style={{ left: '22%', top: '5%', width: '70%', height: '90%', transform: 'rotate(20deg) scale(1.2)', opacity: 0.82, zIndex: 8, boxShadow: '0 18px 36px rgba(0,0,0,0.12)' }}
                    loading="lazy"
                  />

                  

                  {/* Main dress (front) */}
                  <img
                    src="/images/dress 1.jpg"
                    alt="Female dress"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl z-50 ring-2 ring-white"
                    style={{ transform: 'rotate(6deg) scale(1) translateX(0px) translateY(0px)', boxShadow: '0 30px 60px rgba(0,0,0,0.22)', zIndex: 50, opacity: 1 }}
                    loading="lazy"
                  />

                  {/* Suggestion badge (top-right) */}
                  <div className="absolute top-4 right-4 z-60" style={{ zIndex: 60 }}>
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-2 flex items-center gap-3 shadow-md">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">C</div>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">ClosetAI suggests</div>
                        <div className="text-sm font-semibold text-gray-900">Blazer + Heels</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative soft color blob beneath */}
                  <div className="absolute -bottom-6 left-2 w-40 h-12 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl opacity-40 blur-xl transform -rotate-6" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes rotate3d {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          50% { transform: rotateX(6deg) rotateY(-6deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }
        .animate-rotate-3d { animation: rotate3d 6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
