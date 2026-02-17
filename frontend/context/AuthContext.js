import { createContext, useState, useContext, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getUserProfile, updateUserProfile, setAuthToken, loadAuthToken, refresh as apiRefresh } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const PROFILE_CACHE_KEY = 'closetai_profile_v1'
  const PROFILE_CACHE_TTL_MS = 1000 * 60 * 15 // 15 minutes

  useEffect(()=>{
    const token = loadAuthToken()
    if (process.env.NODE_ENV !== 'production') console.log('AuthContext: Token loaded from storage:', !!token)
    if(token){
      // Try to restore cached profile to avoid a network call on every navigation
      try{
        const raw = localStorage.getItem(PROFILE_CACHE_KEY)
        if(raw){
          const parsed = JSON.parse(raw)
          if(parsed.ts && parsed.data){
            const age = Date.now() - parsed.ts
            if(age < PROFILE_CACHE_TTL_MS){
              if (process.env.NODE_ENV !== 'production') console.log('AuthContext: Restoring cached profile')
              setUser(parsed.data)
              // background refresh to extend cache
              fetchUserProfile(true)
              return
            }
          }
        }
      }catch(e){ console.warn('AuthContext: failed reading profile cache', e) }
      if (process.env.NODE_ENV !== 'production') console.log('AuthContext: No valid cached profile, fetching...')
      fetchUserProfile()
    } else {
      // Try to obtain a fresh access token using refresh cookie
      (async ()=>{
        try{
          const r = await apiRefresh()
          if(r?.access_token){
            setAuthToken(r.access_token)
            await fetchUserProfile()
            return
          }
          }catch(e){
          if (process.env.NODE_ENV !== 'production') console.log('AuthContext: refresh failed', e)
        }
        if (process.env.NODE_ENV !== 'production') console.log('AuthContext: No token found, setting user to false')
        setUser(false)
      })()
    }
  }, [])

  async function fetchUserProfile(background = false){
    try {
      if(!background && process.env.NODE_ENV !== 'production') console.log('AuthContext: Calling getUserProfile API...')
      const profile = await getUserProfile()
      if(!background && process.env.NODE_ENV !== 'production') console.log('AuthContext: Profile fetched successfully:', profile)
      setUser(profile)
      try{
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: profile }))
      }catch(e){ console.warn('AuthContext: failed to write profile cache', e) }
    } catch (error) {
      console.error('AuthContext: Failed to fetch user profile:', error)
      // Token is invalid or expired, clear it and set user to false
      setAuthToken(null)
      setUser(false)
      try{ localStorage.removeItem(PROFILE_CACHE_KEY) }catch(e){}
    }
  }

  async function login(creds){
    const res = await apiLogin(creds)
    if(res?.access_token){
      setAuthToken(res.access_token)
      await fetchUserProfile()
    }
    return res
  }

  async function register(creds){
    const res = await apiRegister(creds)
    return res
  }

  async function updateProfile(profileData){
    const res = await updateUserProfile(profileData)
    if(res.message === 'Profile updated successfully'){
      await fetchUserProfile()
    }
    return res
  }

  function logout(){
    setAuthToken(null)
    setUser(false)
    try{ localStorage.removeItem(PROFILE_CACHE_KEY) }catch(e){}
  }

  return <AuthContext.Provider value={{ user, setUser, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
