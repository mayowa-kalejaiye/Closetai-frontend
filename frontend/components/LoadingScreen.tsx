"use client";
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Background fills from bottom (faster now)
    const backgroundTimer = setTimeout(() => {
      setAnimationStep(1);
    }, 200);

    // Logo swipes up from bottom center (earlier since background is faster)
    const logoUpTimer = setTimeout(() => {
      setAnimationStep(2);
    }, 500);

    // Text slides to the right from logo
    const textSlideTimer = setTimeout(() => {
      setAnimationStep(3);
    }, 1200);

    // Complete animation and hide
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(logoUpTimer);
      clearTimeout(textSlideTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transition-transform duration-500 ease-out ${
          animationStep >= 1 ? 'translate-y-0' : 'translate-y-full'
        }`}
      />

      {/* Logo Animation Container */}
      <div className="relative z-10 flex items-center justify-center">
        {/* C Logo */}
        <div
          className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ease-out mr-4 ${
            animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
          }`}
        >
          <span className="text-3xl font-bold text-gray-900 cursive-c">C</span>
        </div>

        {/* ClosetAI Text */}
        <span
          className={`text-4xl font-bold text-white font-space-grotesk tracking-wide transition-all duration-600 ease-out ${
            animationStep >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
          }`}
        >
          ClosetAI
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
