"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div<HTMLDivElement>
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-space-grotesk">
              Why Choose ClosetAI?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of fashion with AI-powered styling that understands your unique taste.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shirt className="w-8 h-8 text-blue-600" />,
                title: "Smart Wardrobe Management",
                description: "Upload and organize your clothes with intelligent categorization and tagging."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-purple-600" />,
                title: "AI Outfit Generation",
                description: "Get personalized outfit suggestions based on weather, occasion, and your style preferences."
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-600" />,
                title: "Learn Your Style",
                description: "Our AI learns from your feedback to provide better recommendations over time."
              }
            ].map((feature, index) => (
              <motion.div<HTMLDivElement>
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2 font-space-grotesk">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div<HTMLDivElement>
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-space-grotesk">
              How It Works
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get styled in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Wardrobe",
                description: "Take photos of your clothes and upload them to your digital closet."
              },
              {
                step: "02",
                title: "AI Analyzes Your Style",
                description: "Our AI learns your preferences, colors, and style patterns."
              },
              {
                step: "03",
                title: "Get Perfect Outfits",
                description: "Receive daily outfit suggestions tailored just for you."
              }
            ].map((step, index) => (
              <motion.div<HTMLDivElement>
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 font-space-grotesk">
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div<HTMLDivElement>
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
              Ready to Transform Your Wardrobe?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Try ClosetAI today — explore outfit suggestions and manage your wardrobe.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Get Started
              <Zap className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer2 />
    </div>
  );
}
