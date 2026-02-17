"use client";
import React, { useState, useEffect } from 'react';
import { generateOutfits, getSavedOutfits, saveOutfit } from '../services/api';
import { Sparkles, RefreshCw, Shirt, Palette, Calendar } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { formatBoldHtml } from '../lib/utils';

// TypeScript interfaces
interface ClothingItem {
  id: number;
  category: string;
  color: string;
  image_url: string;
}

interface Outfit {
  id: number;
  items: ClothingItem[];
  reason: string;
  occasion: string;
  style: string;
}

const OutfitGeneratorDemo: React.FC = () => {
  const COMING_SOON = false
  const [occasion, setOccasion] = useState('casual');
  const [count, setCount] = useState(3);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [options, setOptions] = useState<any>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [stylePref, setStylePref] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try{
        const res = await getSavedOutfits()
        if(!mounted) return
        setSavedOutfits(res.outfits || res)
      }catch(e){
        // ignore if user not logged in or endpoint fails
      }
    })()
    return () => { mounted = false }
  }, [])

  const occasions = [
    { value: 'casual', label: 'Casual', icon: '👕' },
    { value: 'formal', label: 'Formal', icon: '👔' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'date', label: 'Date Night', icon: '💕' },
    { value: 'party', label: 'Party', icon: '🎉' }
  ];

  const generateNewOutfits = async () => {
    // Open prompt modal first to collect detailed options
    if (!showPrompt) {
      // lazy-load options
      try{
        const opts = await (await import('../services/api')).getOutfitOptions()
        setOptions(opts)
      }catch(e){
        console.warn('Failed to load options, using defaults', e)
      }
      setShowPrompt(true)
      return
    }
    setLoading(true);
    try {
      const data = await generateOutfits(occasion, count, season, eventType, stylePref);

      if (data.outfits && data.outfits.length > 0) {
        setOutfits(data.outfits);
      } else {
        setOutfits([]);
        alert("No outfits could be generated. Make sure you have uploaded some clothing items to your wardrobe first!");
      }
    } catch (error) {
      console.error('Failed to generate outfits:', error);
      alert(`Failed to generate outfits: ${error.message || 'Unknown error'}. Please check your wardrobe has items.`);
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  const onPromptSubmit = async (chosen:any) => {
    setShowPrompt(false)
    setOccasion(chosen.occasion)
    setSeason(chosen.season || null)
    setEventType(chosen.event_type || null)
    setStylePref(chosen.style_preference || null)
    setLoading(true)
    try{
      const data = await generateOutfits(chosen.occasion, count, chosen.season, chosen.event_type, chosen.style_preference)
      if (data.outfits && data.outfits.length > 0) setOutfits(data.outfits)
      else setOutfits([])
      // no auto-save; user can explicitly save outfits
    }catch(e){
      console.error('Failed to generate outfits:', e)
      alert('Failed to generate outfits')
    }finally{
      setLoading(false)
    }
  }

  const OutfitCard: React.FC<{ outfit: Outfit }> = ({ outfit }) => (
    <ThreeDCard className="w-full" backgroundImage={(outfit as any).generated_image_url || undefined}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900 dark:text-white capitalize">
            {outfit.style} {outfit.occasion}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          #{outfit.id}
        </span>
      </div>

      {/* Generated Image */}
      {(outfit as any).generated_image_url && (
        <div className="mb-4">
          <img
            src={(outfit as any).generated_image_url}
            alt="Generated outfit"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Outfit Items */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {outfit.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <Shirt className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {item.category}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center">
                <Palette className="w-3 h-3 mr-1" />
                {item.color}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Reason */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm text-blue-800 dark:text-blue-200 italic" dangerouslySetInnerHTML={formatBoldHtml(outfit.reason)} />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={async () => {
            try{
              await saveOutfit(outfit)
              const updated = await getSavedOutfits()
              setSavedOutfits(updated.outfits || updated)
              alert('Outfit saved')
            }catch(e){
              console.error('Failed to save outfit', e)
              alert('Failed to save outfit')
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700"
        >
          Save Outfit
        </button>
      </div>
      </div>
    </ThreeDCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-space-grotesk">
            AI Outfit Generator — Coming Soon
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            This feature is temporarily disabled while we focus on the "Try on" wardrobe experience. Stay tuned!
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl shadow-xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Smart Matching</h3>
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">AI analyzes your wardrobe and creates compatible outfit combinations</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl shadow-xl border border-green-200/50 dark:border-green-800/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Color Harmony</h3>
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">Intelligent color matching ensures your outfits look perfectly coordinated</p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-8 rounded-2xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">Occasion Aware</h3>
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">Tailored suggestions for casual, formal, work, dates, and special occasions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Generate Your Perfect Outfits</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Occasion Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {occasions.map((occ) => (
                  <option key={occ.value} value={occ.value}>
                    {occ.icon} {occ.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Count Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Outfits
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} outfit{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={generateNewOutfits}
              disabled={COMING_SOON || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {COMING_SOON ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Coming Soon</span>
                </>
              ) : loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Outfits</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Modal */}
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl">
              <h3 className="text-lg font-semibold mb-4">Choose outfit type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Occasion</label>
                  <select value={occasion} onChange={e => setOccasion(e.target.value)} className="w-full p-2 border rounded">
                    {(options?.occasions || occasions).map((o:any) => (
                      <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Season</label>
                  <select value={season || ''} onChange={e => setSeason(e.target.value || null)} className="w-full p-2 border rounded">
                    <option value="">Auto</option>
                    {(options?.seasons || ['spring','summer','fall','winter']).map((s:any) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Event (optional)</label>
                  <input placeholder="wedding, casual, etc" className="w-full p-2 border rounded" value={eventType || ''} onChange={e=>setEventType(e.target.value||null)} />
                </div>

                <div>
                  <label className="block text-sm mb-2">Style preference (optional)</label>
                  <select value={stylePref || ''} onChange={e=>setStylePref(e.target.value||null)} className="w-full p-2 border rounded">
                    <option value="">Use profile / Auto</option>
                    {(options?.styles || ['minimalist','bold','formal']).map((s:any)=> (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button className="px-4 py-2 rounded" onClick={() => setShowPrompt(false)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => onPromptSubmit({ occasion, season, event_type: eventType, style_preference: stylePref })}>Proceed</button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {outfits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Your AI-Generated Outfits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          </div>
        )}

        {/* Saved / Past Recommendations */}
        {savedOutfits && savedOutfits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Past Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOutfits.map((outfit) => (
                <OutfitCard key={`saved-${outfit.id}`} outfit={outfit} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {outfits.length === 0 && !loading && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Generate Amazing Outfits?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click "Generate Outfits" to see AI-powered fashion recommendations tailored to your wardrobe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitGeneratorDemo;
