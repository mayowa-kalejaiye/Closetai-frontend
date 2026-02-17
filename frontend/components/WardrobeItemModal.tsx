import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface WardrobeItemModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  sourceRect?: DOMRect;
  autoTryOn?: boolean;
}

import { tryOn } from '../services/api'

const WardrobeItemModal: React.FC<WardrobeItemModalProps> = ({ item, isOpen, onClose, sourceRect, autoTryOn=false }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tryonUrl, setTryonUrl] = useState<string | null>(null)
  const [tryonLoading, setTryonLoading] = useState(false)
  const [tryonError, setTryonError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
    // auto-trigger try-on when opening via Try-on action
    if (isOpen && autoTryOn) {
      (async () => {
        try {
          setTryonLoading(true)
          setTryonError(null)
          const res = await tryOn(item.id || item.id)
          setTryonUrl(res.tryon_url)
        } catch (err: any) {
          setTryonError(err?.message || 'Try-on failed')
        } finally {
          setTryonLoading(false)
        }
      })()
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate stats from item data (dynamic heuristics)
  const colorScore = Math.round((item.detection_confidence || 0.5) * 100);
  const patternScore = item.pattern && item.pattern !== 'unknown' ? Math.min(95, 50 + Math.round((item.detection_confidence || 0.5) * 45)) : 40;
  const categoryScore = item.category ? Math.min(95, 55 + Math.round((item.detection_confidence || 0.5) * 40)) : 40;
  const versatilityScore = (() => {
    const cat = (item.category || '').toLowerCase();
    if (['top', 'bottom', 'shoes'].includes(cat)) return 80;
    if (['accessory', 'hat', 'bag'].includes(cat)) return 65;
    return 70;
  })();
  const conditionScore = item.starred ? 95 : 80;

  const stats = [
    { label: 'Color Match', value: colorScore, max: 100 },
    { label: 'Pattern', value: patternScore, max: 100 },
    { label: 'Category', value: categoryScore, max: 100 },
    { label: 'Versatility', value: versatilityScore, max: 100 },
    { label: 'Condition', value: conditionScore, max: 100 },
  ];

  // Generate radar chart points
  const generateRadarPoints = () => {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 90;
    const angleStep = (Math.PI * 2) / stats.length;

    const points = stats.map((stat, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const radius = (stat.value / stat.max) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y, angle, label: stat.label, value: stat.value };
    });

    return points;
  };

  const radarPoints = generateRadarPoints();
  const pathData = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Background grid points
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 90;
  const angleStep = (Math.PI * 2) / stats.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-4 sm:py-0"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full mx-4 my-4 sm:my-0 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isAnimating && sourceRect 
            ? `slideFromSource 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)` 
            : undefined,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          {/* Left: Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={item.imageUrl || item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              {item.starred && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full">
                  ⭐
                </div>
              )}
              {item.detection_confidence !== undefined && item.detection_confidence !== null && (
                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/75 text-xs md:text-sm px-2 py-1 rounded-full font-medium shadow-md backdrop-blur-sm">
                  Conf: {Math.round((item.detection_confidence || 0) * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Right: Details & Stats */}
          <div className="flex flex-col space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 whitespace-normal break-normal">
                {item.title || 'Clothing Item'}
              </h2>
              {item.type && (
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 capitalize">
                  {item.type}
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {item.category || 'Unknown'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Color</p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {item.color || 'Unknown'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pattern</p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {item.pattern || 'Unknown'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Occasion</p>
                <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {item.occasion || 'Casual'}
                </p>
              </div>
            </div>

            {/* Stats Radar Chart */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Item Stats</h3>
              <div className="flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full max-w-sm" preserveAspectRatio="xMidYMid meet">
                  {/* Background grid */}
                  {gridLevels.map((level, idx) => {
                    const gridPoints = stats.map((_, i) => {
                      const angle = angleStep * i - Math.PI / 2;
                      const radius = maxRadius * level;
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ') + ' Z';
                    
                    return (
                      <path
                        key={idx}
                        d={gridPoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-gray-300 dark:text-gray-700"
                        opacity={0.3}
                      />
                    );
                  })}

                  {/* Axis lines */}
                  {radarPoints.map((point, index) => (
                    <line
                      key={index}
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + maxRadius * Math.cos(point.angle)}
                      y2={centerY + maxRadius * Math.sin(point.angle)}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400 dark:text-gray-600"
                    />
                  ))}

                  {/* Data area */}
                  <path
                    d={pathData}
                    fill="url(#radarGradient)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    opacity="0.8"
                  />

                  {/* Data points */}
                  {radarPoints.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="rgb(59, 130, 246)"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Labels */}
                  {radarPoints.map((point, index) => {
                    const labelAngle = point.angle;
                    const labelRadius = maxRadius + 35;
                    const labelX = centerX + labelRadius * Math.cos(labelAngle);
                    const labelY = centerY + labelRadius * Math.sin(labelAngle);
                    
                    return (
                      <text
                        key={index}
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-700 dark:fill-gray-300"
                        dominantBaseline="middle"
                      >
                        {point.label}
                      </text>
                    );
                  })}

                  {/* Gradient definition */}
                  <defs>
                    <radialGradient id="radarGradient">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Confidentiality is shown as an overlay on the image */}

            {/* Try-on action (disabled until feature launches) */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => { alert('Try-on is coming soon — stay tuned!') }}
                className="px-6 py-3 rounded-2xl bg-indigo-400 text-white font-semibold cursor-not-allowed"
                title="Try-on (coming soon)"
              >
                Try-on (coming soon)
              </button>
            </div>

            {tryonError && (
              <div className="text-sm text-red-600 text-center mt-2">{tryonError}</div>
            )}

            {tryonUrl && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Try-on Preview</h4>
                <img src={tryonUrl} alt="Try-on preview" className="w-full rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideFromSource {
          from {
            transform: translate(var(--source-x, 0), var(--source-y, 0)) scale(0.1);
            opacity: 0;
          }
          to {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default WardrobeItemModal;
