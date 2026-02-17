import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

// Simple client-side cache for wardrobe list to avoid repeated fetches
const WARDROBE_CACHE_KEY = 'closetai_wardrobe_cache_v1'
const WARDROBE_CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes

function readWardrobeCache(){
  if(typeof window === 'undefined') return null
  try{
    const raw = localStorage.getItem(WARDROBE_CACHE_KEY)
    if(!raw) return null
    const parsed = JSON.parse(raw)
    if(!parsed.ts || !parsed.data) return null
    const age = Date.now() - parsed.ts
    return { data: parsed.data, age }
  }catch(e){
    console.warn('Wardrobe cache read failed', e)
    return null
  }
}

function writeWardrobeCache(data){
  if(typeof window === 'undefined') return
  try{
    localStorage.setItem(WARDROBE_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }))
  }catch(e){
    console.warn('Wardrobe cache write failed', e)
  }
}

function invalidateWardrobeCache(){
  if(typeof window === 'undefined') return
  try{ localStorage.removeItem(WARDROBE_CACHE_KEY) }catch(e){}
}

// Load token immediately on module import
const token = typeof window !== 'undefined' ? localStorage.getItem('closetai_token') : null
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export async function getTodayOutfits(){
  const res = await api.get('/outfits/today')
  return res.data
}

export async function uploadWardrobeItem(formData){
  // Accept optional third parameter for axios config (e.g., { signal })
  const axiosConfig = arguments[1] || { headers: { 'Content-Type': 'multipart/form-data' } };
  // Ensure Content-Type is set for multipart uploads when not provided
  axiosConfig.headers = axiosConfig.headers || { 'Content-Type': 'multipart/form-data' };
  const res = await api.post('/wardrobe/upload', formData, axiosConfig)
  // Uploaded new item — invalidate wardrobe cache so subsequent reads are fresh
  invalidateWardrobeCache()
  return res.data
}

export async function getWardrobeItems(){
  // Serve from cache if available (stale-while-revalidate)
  const cached = readWardrobeCache()
  if(cached && cached.age < WARDROBE_CACHE_TTL_MS){
    // Kick off background refresh but don't block UI
    api.get('/wardrobe/').then(r => writeWardrobeCache(r.data)).catch(()=>{})
    return cached.data
  }

  const res = await api.get('/wardrobe/')
  try{ writeWardrobeCache(res.data) }catch(e){}
  return res.data
}

export async function toggleLike(itemId){
  const res = await api.put(`/wardrobe/${itemId}/like`)
  invalidateWardrobeCache()
  return res.data
}

export async function updateCategory(itemId, category){
  const res = await api.put(`/wardrobe/${itemId}/category`, { category })
  invalidateWardrobeCache()
  return res.data
}

export async function updateColor(itemId, color){
  const res = await api.put(`/wardrobe/${itemId}/color`, { color })
  invalidateWardrobeCache()
  return res.data
}

export async function updateOccasion(itemId, occasion){
  const res = await api.put(`/wardrobe/${itemId}/occasion`, { occasion })
  invalidateWardrobeCache()
  return res.data
}

export async function updatePattern(itemId, pattern){
  const res = await api.put(`/wardrobe/${itemId}/pattern`, { pattern })
  invalidateWardrobeCache()
  return res.data
}

export async function toggleStar(itemId){
  const res = await api.put(`/wardrobe/${itemId}/star`)
  invalidateWardrobeCache()
  return res.data
}

export async function updateWardrobeItemImage(itemId, imageFile){
  const formData = new FormData()
  formData.append('image', imageFile)
  const res = await api.put(`/wardrobe/${itemId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  invalidateWardrobeCache()
  return res.data
}

export async function deleteWardrobeItem(itemId){
  const res = await api.delete(`/wardrobe/${itemId}`)
  invalidateWardrobeCache()
  return res.data
}

export async function analyzeClothingImage(file){
  const formData = new FormData()
  formData.append('file', file)
  // Accept optional second parameter for axios config (e.g., { signal })
  const axiosConfig = arguments[1] || { headers: { 'Content-Type': 'multipart/form-data' } };
  axiosConfig.headers = axiosConfig.headers || { 'Content-Type': 'multipart/form-data' };
  const res = await api.post('/vision/analyze-clothing', formData, axiosConfig)
  return res.data
}

export async function getUploadLimits(){
  const res = await api.get('/wardrobe/upload-limits')
  return res.data
}

export async function canUpload(){
  const res = await api.get('/wardrobe/can-upload')
  return res.data
}

export async function generateOutfits(occasion = 'casual', count = 3){
  const params = { occasion, count }
  // Accept optional extra args
  if (arguments[2]) params.season = arguments[2]
  if (arguments[3]) params.event_type = arguments[3]
  if (arguments[4]) params.style_preference = arguments[4]

  const res = await api.get('/outfits/generate', { params })
  return res.data
}

export async function getOutfitOptions(){
  const res = await api.get('/outfits/options')
  return res.data
}

export async function getPreferences(){
  const res = await api.get('/users/preferences')
  return res.data
}

export async function setPreferences(preferences){
  const form = new FormData()
  if(preferences.style_preference) form.append('style_preference', preferences.style_preference)
  if(preferences.preferred_colors) form.append('preferred_colors', preferences.preferred_colors)
  if(preferences.preferred_seasons) form.append('preferred_seasons', preferences.preferred_seasons)
  if(preferences.preferred_events) form.append('preferred_events', preferences.preferred_events)
  const res = await api.put('/users/preferences', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data
}

export async function saveOutfit(outfit){
  const res = await api.post('/outfits/save', outfit)
  return res.data
}

export async function getSavedOutfits(){
  const res = await api.get('/outfits/saved')
  return res.data
}

export async function deleteSavedOutfit(outfitId){
  const res = await api.delete(`/outfits/saved/${outfitId}`)
  return res.data
}

export async function createShareSnapshot(outfitId){
  const res = await api.post(`/outfits/saved/${outfitId}/share`)
  return res.data
}

export async function getUserProfile(){
  const res = await api.get('/auth/me')
  return res.data
}

export async function getUserLimits(){
  const res = await api.get('/auth/limits')
  return res.data
}

export async function updateUserProfile(profileData){
  // Check if profileData is FormData (contains files) or regular object
  if (profileData instanceof FormData) {
    const res = await api.put('/users/profile', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } else {
    // For backward compatibility with existing auth/profile endpoint
    const res = await api.put('/auth/profile', profileData)
    return res.data
  }
}

export async function submitFeedback(outfitId, liked){
  const res = await api.post('/feedback/', { outfit_id: outfitId, liked })
  return res.data
}

export async function register(body){
  const res = await api.post('/auth/register', body)
  return res.data
}

export async function login(body){
  const res = await api.post('/auth/login', body)
  return res.data
}

export async function refresh(){
  const res = await api.post('/auth/refresh')
  return res.data
}

export function setAuthToken(token){
  if(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('closetai_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('closetai_token')
  }
}

export function loadAuthToken(){
  // Check for the new token key first, then fallback to old key for backward compatibility
  let token = typeof window !== 'undefined' ? localStorage.getItem('closetai_token') : null
  if (process.env.NODE_ENV !== 'production') console.log('loadAuthToken: Token from closetai_token:', !!token)
  if (!token) {
    token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (process.env.NODE_ENV !== 'production') console.log('loadAuthToken: Token from old token key:', !!token)
    // If found old token, migrate it to new key
    if (token) {
      localStorage.setItem('closetai_token', token)
      localStorage.removeItem('token')
    }
  }
  // Set the authorization header if token exists and not already set
    if(token && !api.defaults.headers.common['Authorization']) {
    if (process.env.NODE_ENV !== 'production') console.log('loadAuthToken: Setting Authorization header')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else if (token) {
    if (process.env.NODE_ENV !== 'production') console.log('loadAuthToken: Authorization header already set')
  } else {
    if (process.env.NODE_ENV !== 'production') console.log('loadAuthToken: No token found')
  }
  return token
}

export async function getAvailablePlans(){
  const res = await api.get('/auth/plans')
  return res.data
}

export async function checkFeatureAccess(feature){
  const res = await api.get(`/auth/feature-access/${feature}`)
  return res.data
}

export async function getUpgradeInfo(feature = null){
  const res = await api.get('/auth/upgrade-info', { params: feature ? { feature } : {} })
  return res.data
}

export async function joinEarlyAccess(email){
  const res = await api.post('/auth/join-early-access', { email })
  return res.data
}

export async function tryOn(itemId){
  const res = await api.get(`/wardrobe/${itemId}/tryon`)
  return res.data
}
