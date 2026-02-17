'use client'
import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Header3() {
  const { user, logout } = useAuth()
  // State to manage mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  // State for profile dropdown
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // State for header visibility on scroll
  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // Effect to handle body scroll lock when menu is open
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset scroll on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Effect to close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Effect to handle header visibility on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the very top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsHeaderVisible(true);
      }
      // Hide header when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Rotating fashion trend links (word links). Changes every 4.5s.
  const trendLinks = [
    { text: 'Sustainable Outerwear', url: 'https://www.vogue.com/fashion' },
    { text: 'Minimalist Capsule Looks', url: 'https://www.harpersbazaar.com/fashion' },
    { text: 'Bold Color Combos', url: 'https://www.elle.com/fashion' },
    { text: 'Seasonal Staples', url: 'https://www.gq.com/style' },
  ];
  const [trendIndex, setTrendIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTrendIndex(i => (i + 1) % trendLinks.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isHeaderVisible ? 'transform-none' : '-translate-y-full'}`}>
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 w-full bg-white/80 backdrop-blur-md border-b border-white/30">
        {/* Desktop Navigation (Left) */}
        <nav className="hidden md:flex items-center gap-6 text-sm md:text-base lg:text-lg font-medium text-gray-800 flex-1">
          <a
            href={trendLinks[trendIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            title={trendLinks[trendIndex].text}
            className="text-gray-600 italic inline-block max-w-[10rem] sm:max-w-[20rem] md:max-w-xs lg:max-w-md truncate hover:underline"
            aria-live="polite"
          >
            {trendLinks[trendIndex].text}
          </a>
          <a href="#pricing" className="hover:text-gray-600 transition-colors">Pricing</a>
        </nav>

        {/* Mobile Menu Toggle (Hamburger/Close Icon) */}
        <div className="md:hidden flex-1">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="text-gray-800">
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" aria-label="ClosetAI Logo">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-black bg-transparent">
              <span className="text-[rgb(31,41,55)] cursive-c">C</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation (Right) */}
        <nav className="hidden md:flex items-center justify-end gap-6 text-sm md:text-base lg:text-lg flex-1">
          {user ? (
            // Authenticated user navigation
            <>
              <Link href="/wardrobe" className="font-medium text-gray-800 hover:text-gray-600 transition-colors">Wardrobe</Link>
              <Link href="/today" className="font-medium text-gray-800 hover:text-gray-600 transition-colors">Today</Link>
              
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 font-medium text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {user.face_image_url ? (
                    <img 
                      src={user.face_image_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="hidden lg:inline-block max-w-[12rem] truncate">{user.full_name || 'Profile'}</span>
                  <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500 max-w-[16rem] truncate" title={user.email}>{user.email}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_premium
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_premium ? 'Premium' : 'Free'}
                        </div>
                      </div>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        setIsProfileOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Non-authenticated user navigation
            <>
              <Link href="/wardrobe" className="font-medium text-gray-800 hover:text-gray-600 transition-colors">Wardrobe</Link>
              <Link href="/today" className="font-medium text-gray-800 hover:text-gray-600 transition-colors">Today</Link>
              <Link href="/login" className="font-medium text-gray-800 hover:text-gray-600 transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 text-sm font-semibold border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Sign Up button visible on mobile (Right side) - only show if not authenticated */}
        {!user && (
          <div className="md:hidden flex-1 flex justify-end">
            <Link href="/register" className="px-4 py-2 text-sm font-semibold border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu (Fullscreen Overlay) */}
      <div className={`md:hidden fixed inset-0 bg-white/90 backdrop-blur-md transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform-none' : '-translate-x-full'} z-40`}>
        <div className="flex justify-between items-center p-4 border-b border-white/30">
          <Link href="/" aria-label="ClosetAI Logo">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-black bg-transparent">
              <span className="text-[rgb(31,41,55)] cursive-c">C</span>
            </div>
          </Link>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-16 gap-8 text-xl text-gray-800 font-medium">
          {user ? (
            // Authenticated user mobile menu
            <>
              <Link href="/wardrobe" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Wardrobe</Link>
              <Link href="/today" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Today</Link>
              
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Profile</Link>
              <button 
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            // Non-authenticated user mobile menu
            <>
              <Link href="/wardrobe" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Wardrobe</Link>
              <Link href="/today" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Today</Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Sign In</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-600 transition-colors">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
