"use client";
import React, { useState, useEffect } from 'react';
import { submitFeedback, saveOutfit, getSavedOutfits, generateOutfits, getOutfitOptions, createShareSnapshot, deleteSavedOutfit, getUserLimits } from '../services/api';
import { formatBoldHtml } from '../lib/utils';
import ThreeDCard from './ThreeDCard';
import { useAuth } from '../context/AuthContext';
import UpgradeModal from './UpgradeModal';

// Outfit shape used across this file
interface OutfitProps {
  id: number;
  items?: any[];
  reason?: string;
  occasion?: string;
  style?: string;
  completeness?: number;
  liked?: boolean;
  disliked?: boolean;
  generated_image_url?: string;
  tryon_image_url?: string;
  visualization_type?: string;
  llm_reasoning?: string;
  styling_tips?: string;
  llm_score?: number;
  event_type?: string;
  season?: string;
  [key: string]: any;
}

function capitalize(s){
  if(!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function buildHeadline(style, occasion, items, reason){
  const s = (style || '').trim()
  if(s) return `${capitalize(s)} - ${occasion || ''}`.trim()
  if(reason) return `${reason} - ${occasion || ''}`.trim()
  if(items && items.length > 0){
    const it = items[0]
    const color = it?.color || ''
    const cat = it?.category || ''
    const first = `${capitalize(color)} ${capitalize(cat)}`.trim()
    return `${first}${occasion? ' - ' + occasion: ''}`.trim()
  }
  return `Outfit${occasion? ' - ' + occasion : ''}`
}
// Outfit Card Component
function OutfitCard(props: OutfitProps & {
  onFeedback: (id: number, feedback: 'like' | 'dislike') => void;
  user: any;
  onUpgradeNeeded: (feature: string) => void;
}) {
  const {
    id,
    items = [],
    reason = '',
    occasion = '',
    style = '',
    completeness = 0,
    liked = false,
    disliked = false,
    generated_image_url,
    tryon_image_url,
    visualization_type,
    llm_reasoning,
    styling_tips,
    llm_score,
    onFeedback,
    user,
    onUpgradeNeeded,
  } = props as any;

  const isCompleteOutfit = completeness && completeness >= 3;
  const hasVisualAccess = user?.is_premium || !generated_image_url;
  const hasLLMInsights = Boolean(llm_reasoning || styling_tips);
  const visualImage = tryon_image_url || generated_image_url;

  return (
    <div onClick={() => props.onOpen && props.onOpen()} className="w-full">
      <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-200 dark:border-black shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full font-space-grotesk cursor-pointer">
        <div className="relative p-2 sm:p-2.5">
          {/* Outfit Items Preview */}
          <div className="relative">
            {visualImage && hasVisualAccess ? (
              <div className="w-full h-48 sm:h-64 md:h-72 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden">
                <img src={visualImage} alt={visualization_type === 'virtual_tryon' ? 'Virtual Try-On' : 'AI Generated Outfit'} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 ${visualization_type === 'virtual_tryon' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-purple-500'} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {visualization_type === 'virtual_tryon' ? '🎨 Virtual Try-On' : 'Premium'}
                </div>
              </div>
            ) : visualImage && !hasVisualAccess ? (
              <div className="w-full h-40 sm:h-48 md:h-56 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center cursor-pointer" onClick={() => onUpgradeNeeded('visual_outfits')}>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">👗</span>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-1">Visual Outfits</h4>
                  <p className="text-sm text-purple-600 mb-3">See AI-generated outfits with your face</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl flex flex-wrap items-center justify-center gap-2 p-2 overflow-hidden">
                {items.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-1">
                      {item.image_url ? <img src={item.image_url} alt={`${item.color} ${item.category}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-xs text-gray-600 dark:text-gray-300 capitalize">{item.category}</span></div>}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize text-center">{item.color} {item.category}</span>
                  </div>
                ))}
                {items.length > 4 && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center mb-1"><span className="text-xs text-gray-600 dark:text-gray-300">+{items.length - 4}</span></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">more</span>
                  </div>
                )}
              </div>
            )}

            {isCompleteOutfit && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">Complete</div>}
          </div>

            <div className="mt-3 sm:mt-4 px-1 sm:px-1.5 pb-2 sm:pb-3 pt-1 sm:pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate pr-2">{(style || '').charAt(0).toUpperCase() + (style || '').slice(1)} {(occasion || '').charAt(0).toUpperCase() + (occasion || '').slice(1)}</h3>
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 italic leading-relaxed" dangerouslySetInnerHTML={formatBoldHtml(llm_reasoning || reason)} />

            {hasLLMInsights && styling_tips && <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"><h4 className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1 flex items-center"><span className="mr-1.5">✨</span>AI Styling Tips</h4><div className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed" dangerouslySetInnerHTML={formatBoldHtml(styling_tips)} /></div>}

            {llm_score !== undefined && llm_score > 0.8 && <div className="mt-2 inline-flex items-center text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full"><span className="mr-1">⭐</span>AI Recommended</div>}

            <div className="mt-3 sm:mt-4 flex justify-between items-center space-x-2">
              <div className="flex items-center space-x-2">
                <button onClick={(e) => { e.stopPropagation(); onFeedback(id, 'like'); }} className={`px-4 py-3 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors ${liked ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'}`}>👍 Like</button>
                <button onClick={(e) => { e.stopPropagation(); onFeedback(id, 'dislike'); }} className={`px-4 py-3 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors ${disliked ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'}`}>👎 Dislike</button>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={async (e) => { e.stopPropagation(); try { await saveOutfit({ id, items, reason, occasion, style, generated_image_url, tryon_image_url }); alert('Outfit saved') } catch (e) { console.error('Failed to save outfit', e); alert('Failed to save outfit') } }} className="px-4 py-3 md:py-2 bg-indigo-600 text-white rounded-md text-sm md:text-base font-medium hover:bg-indigo-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Outfit Detail Modal for Today's page
function OutfitDetailModal({ outfit, onClose }: { outfit: any, onClose: () => void }){
  if(!outfit) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Outfit #{outfit.id}</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-10">
          <div className="p-4 md:col-span-3 md:border-r md:border-gray-100 dark:md:border-gray-800 h-auto md:h-[70vh] overflow-y-auto">
            <h4 className="text-sm font-semibold mb-3">Items</h4>
            <div className="space-y-3">
              {outfit.items && outfit.items.length > 0 ? outfit.items.map((it:any) => (
                <div key={it.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                    {it.image_url ? <img src={it.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">{it.category}</div>}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{it.category}</div>
                    <div className="text-xs text-gray-500">{it.color}</div>
                  </div>
                </div>
              )) : <div className="text-sm text-gray-500">No items</div>}
            </div>
          </div>
          <div className="p-6 md:col-span-7 overflow-y-auto h-auto md:h-[70vh]">
            <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img src={outfit.generated_image_url || outfit.tryon_image_url || (outfit.items?.[0]?.image_url)} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xl md:text-2xl font-semibold mb-2">{buildHeadline(outfit.style, outfit.occasion, outfit.items, outfit.reason)}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic mb-4">"{outfit.reason}"</p>
            {outfit.styling_tips && (
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 rounded mb-4">
                <h5 className="text-sm font-semibold mb-1">Styling Tips</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{outfit.styling_tips}</p>
              </div>
            )}

            <div className="flex space-x-2">
              <button onClick={async () => { try{ await saveOutfit(outfit); alert('Saved') }catch(e){ alert('Failed') } }} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
              <button onClick={() => { navigator?.clipboard?.writeText(JSON.stringify(outfit)); alert('Copied') }} className="px-4 py-2 bg-gray-100 rounded">Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Today Outfits Component
const TodayOutfits: React.FC = () => {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<OutfitProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [savedOutfits, setSavedOutfits] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [expandedSavedId, setExpandedSavedId] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<any | null>(null);
  const [outfitModalOpen, setOutfitModalOpen] = useState(false);

  // Previously we auto-fetched "today" outfits; change UX so users pick what to generate.
  const [occasion, setOccasion] = useState('casual');
  const [count, setCount] = useState(3);
  const [season, setSeason] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [stylePref, setStylePref] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [options, setOptions] = useState<any>(null);
  const [limits, setLimits] = useState<any | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    // clear loading on mount; user will choose to generate
    setLoading(false);
    // Load any local block expiration
    try{
      const saved = typeof window !== 'undefined' ? localStorage.getItem('outfit_block_until') : null
      if(saved){
        const t = parseInt(saved,10)
        if(!isNaN(t) && t > Date.now()) setBlockedUntil(t)
      }
    }catch(e){}
    // Fetch limits for button state
    (async ()=>{
      try{
        const l = await getUserLimits()
        setLimits(l)
        const current = l?.outfit_generation?.daily?.current || 0
        const max = l?.outfit_generation?.daily?.max || 3
        if(current >= max){
          // If over limit, set a client-side block expiration based on server reset hours
          const hours = l?.resets?.daily_hours || 24
          const until = Date.now() + Math.round(hours * 3600 * 1000)
          setBlockedUntil(until)
          try{ localStorage.setItem('outfit_block_until', String(until)) }catch(e){}
        }
      }catch(e){
        // ignore
      }
    })()
  }, []);

  // Countdown timer effect
  useEffect(()=>{
    if(!blockedUntil){ setCountdown(null); return }
    const update = ()=>{
      const diff = Math.max(0, blockedUntil - Date.now())
      if(diff <= 0){ setBlockedUntil(null); try{ localStorage.removeItem('outfit_block_until') }catch(e){}; setCountdown(null); return }
      const hrs = Math.floor(diff/3600000)
      const mins = Math.floor((diff % 3600000)/60000)
      const secs = Math.floor((diff % 60000)/1000)
      setCountdown(`${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`)
    }
    update();
    const iv = setInterval(update, 1000)
    return ()=> clearInterval(iv)
  }, [blockedUntil])

  async function openSavedModal(){
    setSavedModalOpen(true)
    setLoadingSaved(true)
    try{
      const res = await getSavedOutfits()
      setSavedOutfits(res.outfits || res)
    }catch(e){
      console.error('Failed to fetch saved outfits', e)
      setSavedOutfits([])
    }finally{
      setLoadingSaved(false)
    }
  }

  const handleFeedback = async (outfitId: number, feedback: 'like' | 'dislike') => {
    try {
      await submitFeedback(outfitId, feedback === 'like');
      setOutfits(prev => prev.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, liked: feedback === 'like', disliked: feedback === 'dislike' }
          : outfit
      ));
    } catch (e) {
      console.error('Failed to submit feedback', e);
      // Fallback to local update
      setOutfits(prev => prev.map(outfit =>
        outfit.id === outfitId
          ? { ...outfit, liked: feedback === 'like', disliked: feedback === 'dislike' }
          : outfit
      ));
    }
  };

  const generateForToday = async () => {
    // Prevent generating while blocked
    if(blockedUntil && blockedUntil > Date.now()){
      alert(`You've reached your daily outfit limit - try again in ${countdown || 'a bit'}`)
      return
    }

    try { getOutfitOptions().then(o => setOptions(o)).catch(()=>{}); } catch(e){}

    setLoading(true);
    try {
      // Pre-check server limits to avoid wasting client calls
      try{
        const l = await getUserLimits()
        setLimits(l)
        const current = l?.outfit_generation?.daily?.current || 0
        const max = l?.outfit_generation?.daily?.max || 3
        if(current >= max){
          // server says limit reached
          const until = Date.now() + 24*3600*1000 // Start 24h client timer as requested
          setBlockedUntil(until)
          try{ localStorage.setItem('outfit_block_until', String(until)) }catch(e){}
          alert('You\'ve reached your daily outfit limit. Try again tomorrow.')
          setLoading(false)
          return
        }
      }catch(e){ /* ignore pre-check errors */ }

      const data = await generateOutfits(occasion, count, season, eventType, stylePref);
      if (data.outfits && data.outfits.length > 0) {
        setOutfits(data.outfits);

        // Auto-save generated outfits to Past Recommendations
        try {
          const saves = await Promise.allSettled(data.outfits.map((o:any) => saveOutfit(o)));
          const fulfilled = saves.filter(s => s.status === 'fulfilled').map((s:any) => s.value).filter(Boolean);
          if (fulfilled.length > 0) {
            setSavedOutfits(prev => {
              const prevArr = prev || [];
              // prepend newest
              return [...fulfilled, ...prevArr];
            });
          }
        } catch (e) {
          console.warn('Auto-save failed for some outfits', e);
        }

      } else {
        setOutfits([]);
        alert('No outfits could be generated. Add more wardrobe items if needed.');
      }
    } catch (e) {
      console.error('Failed to generate outfits:', e);
      // If server returned 429 (limit exceeded), start client-side block timer
      if(e?.response?.status === 429){
        const until = Date.now() + 24*3600*1000
        setBlockedUntil(until)
        try{ localStorage.setItem('outfit_block_until', String(until)) }catch(err){}
        alert('You\'ve reached your daily outfit limit. Try again tomorrow.')
      } else {
        alert('Failed to generate outfits. Please try again.');
      }
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && outfits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generating your perfect outfits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden pt-32">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Header Section (two-column: description + controls) */}
        <div className="mt-16 mb-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 font-space-grotesk">Today's Outfits</h1>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">Personalized outfit suggestions generated from your wardrobe. Provide quick feedback to improve future recommendations.</p>
              <div className="mt-4">
                <button onClick={openSavedModal} className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 border border-blue-200 rounded-md shadow-sm hover:bg-blue-50">View Past Recommendations</button>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Generate</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Occasion</label>
                    <select value={occasion} onChange={e => setOccasion(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm">
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="work">Work</option>
                      <option value="date">Date Night</option>
                      <option value="party">Party</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Number</label>
                      <select value={count} onChange={e => setCount(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm">
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} outfit{n>1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-xs text-gray-500 mb-1">Style</label>
                      <select value={stylePref || ''} onChange={e => setStylePref(e.target.value || null)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-sm">
                        <option value="">Auto</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="bold">Bold</option>
                        <option value="formal">Formal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={generateForToday}
                      disabled={!!blockedUntil && blockedUntil > Date.now()}
                      aria-disabled={!!blockedUntil && blockedUntil > Date.now()}
                      className={`w-full px-4 py-3 rounded-md font-medium ${blockedUntil && blockedUntil > Date.now() ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                      {blockedUntil && blockedUntil > Date.now() ? `Reached daily limit - try again in ${countdown || '00:00:00'}` : 'Generate Outfits'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outfits Grid */}
        {outfits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No outfits yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Use the controls above to generate outfits tailored to your wardrobe, or add more wardrobe items to improve results.</p>
            <div>
              <button onClick={() => window.location.href = '/wardrobe'} className="px-6 py-3 bg-gray-100 rounded-md">Manage Wardrobe</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-8">
            {outfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                {...outfit}
                onFeedback={handleFeedback}
                user={user}
                onUpgradeNeeded={(feature) => {
                  setUpgradeFeature(feature);
                  setShowUpgradeModal(true);
                }}
                onOpen={() => { setSelectedOutfit(outfit); setOutfitModalOpen(true); }}
              />
            ))}
          </div>
        )}

        {/* Generate More Button - only show if we have outfits */}
        {outfits.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Generate New Outfits

              {/* Outfit Detail Modal */}
              {outfitModalOpen && selectedOutfit && (
                <OutfitDetailModal outfit={selectedOutfit} onClose={() => setOutfitModalOpen(false)} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature || undefined}
      />

      {/* Saved Outfits Modal */}
      {savedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSavedModalOpen(false)} />
          <div className="relative z-10 w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold">Past Recommendations</h3>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-600 dark:text-gray-300" onClick={() => setSavedModalOpen(false)}>Close</button>
              </div>
            </div>

              <div className="grid md:grid-cols-10">
                {/* Left: vertical scroll list */}
                <div className="md:col-span-3 border-r border-gray-100 dark:border-gray-800 overflow-y-auto scroll-smooth snap-y snap-mandatory p-4">
                {loadingSaved ? (
                  <div className="flex items-center justify-center h-full">Loading…</div>
                ) : savedOutfits.length === 0 ? (
                  <div className="text-center text-sm text-gray-500">No saved outfits yet.</div>
                ) : (
                  <div className="space-y-4">
                    {savedOutfits.map((o:any) => (
                      <div key={o.id} className={`snap-start transition-transform duration-200 ${expandedSavedId === o.id ? 'scale-105' : 'hover:scale-105'}`}>
                        <div onClick={() => setExpandedSavedId(prev => prev === o.id ? null : o.id)}>
                          <ThreeDCard className="rounded-lg" backgroundImage={o.generated_image_url || (o.items?.[0]?.image_url) || undefined}>
                            <div className="p-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{buildHeadline(o.style, o.occasion, o.items, o.reason)}</div>
                              <div className="text-xs text-gray-500">#{o.id}</div>
                            </div>
                          </ThreeDCard>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: detail panel */}
              <div className="md:col-span-7 p-6 overflow-y-auto">
                {expandedSavedId ? (
                  (() => {
                    const item = savedOutfits.find(s => s.id === expandedSavedId)
                    if(!item) return <div className="text-sm text-gray-500">Not found</div>
                    return (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1">
                          <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                                  <img src={item.generated_image_url || item.tryon_image_url || item.items?.[0]?.image_url} className="w-full h-full object-cover" />
                                </div>
                          <div className="grid grid-cols-2 gap-2">
                            {item.items?.map((it:any) => (
                              <div key={it.id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                <img src={it.image_url} className="w-12 h-12 object-cover rounded" />
                                <div>
                                  <div className="text-sm font-medium">{it.category}</div>
                                  <div className="text-xs text-gray-500">{it.color}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <h4 className="text-xl font-semibold mb-2">{buildHeadline(item.style, item.occasion, item.items, item.reason)}</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-300 italic mb-4" dangerouslySetInnerHTML={formatBoldHtml(item.reason)} />
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.event_type && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">{item.event_type}</span>}
                            {item.season && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">{item.season}</span>}
                            {item.style && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">{item.style}</span>}
                          </div>
                          <div className="mb-4">
                            {item.styling_tips && (
                              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 rounded">
                                <h5 className="text-sm font-semibold mb-1">Styling Tips</h5>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{item.styling_tips}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={async () => {
                              try{
                                const res = await createShareSnapshot(item.id)
                                const shareUrl = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}${res.share_url}` : res.share_url
                                const shareText = "Check out this outfit I found with ClosetAI - what do you think?"
                                if (navigator?.share) {
                                  try {
                                    await navigator.share({ title: 'ClosetAI Outfit', text: shareText, url: shareUrl })
                                  } catch (e) {
                                    // user cancelled or sharing failed; fallback to copy
                                    await navigator.clipboard.writeText(shareUrl)
                                    alert('Link copied to clipboard')
                                  }
                                } else {
                                  await navigator.clipboard.writeText(shareUrl)
                                  alert('Link copied to clipboard')
                                }
                              } catch (e) {
                                console.error('Share failed', e)
                                alert('Failed to create share link')
                              }
                            }} className="px-4 py-2 bg-gray-100 rounded">Share</button>

                            <button onClick={async () => {
                              try{ await saveOutfit(item); alert('Saved') }catch(e){ alert('Failed') }
                            }} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>

                            <button onClick={async () => {
                              if(!confirm('Delete this saved outfit? This cannot be undone.')) return
                              try{
                                await deleteSavedOutfit(item.id)
                                // remove locally
                                setSavedOutfits(prev => prev.filter(s => s.id !== item.id))
                                setExpandedSavedId(null)
                                alert('Deleted')
                              }catch(e){
                                console.error('Delete failed', e)
                                alert('Failed to delete outfit')
                              }
                            }} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <div className="text-sm text-gray-500">Select an outfit on the left to view details.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayOutfits;
