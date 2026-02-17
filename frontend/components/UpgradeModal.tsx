"use client";
import React, { useState } from 'react';
import { joinEarlyAccess } from '../services/api';
import { Sparkles, Check, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  upgradeInfo?: any;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  feature,
  upgradeInfo
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await joinEarlyAccess(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to join early access:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const premiumFeatures = [
    'Unlimited daily uploads (100 vs 10)',
    'Advanced AI styling recommendations',
    'Save and organize favorite outfits',
    'Personalized style learning over time',
    'Priority customer support',
    'Export outfits to social media'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 font-space-grotesk">
                Premium Coming Soon
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {feature
                ? `You've reached the limit for ${feature}. Upgrade to Premium for unlimited access!`
                : "Unlock the full potential of ClosetAI with Premium features."
              }
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Premium Features Include:</h3>
              <ul className="space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium">
                🚀 Premium is launching soon! Join our early access list for exclusive updates and special launch pricing.
              </p>
            </div>
          </div>

          {/* Early Access Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Early Access List'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                You're on the list! 🎉
              </h3>
              <p className="text-gray-600">
                We'll notify you as soon as Premium features are available.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
