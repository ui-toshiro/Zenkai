import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Music, Mic2, Star, Bookmark, User, LogOut, ShieldCheck, Menu, X, Sparkles, Bell, Ticket, MapPin, Calendar, ChevronDown, Share2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import AuthModal from './AuthModal';
import CityModal from './CityModal';
import ShareModal from './ShareModal';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { selectedCity, selectedState, selectCity, cities, setIsCityModalOpen } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <span className="text-2xl transform group-hover:scale-110 transition-transform">🍿</span>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                  ZENKAI
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 -mt-1 hidden sm:block">
                  Movies & Music Events
                </span>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-slate-600">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-slate-100 text-indigo-600 font-bold' : 'hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>

              {/* Movies Link */}
              <Link
                to="/search?type=movies"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  location.search.includes('type=movies')
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-indigo-600" />
                Movies
              </Link>

              {/* Dedicated Upcoming Movies Link */}
              <Link
                to="/upcoming"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/upcoming')
                    ? 'bg-amber-50 text-amber-800 font-bold'
                    : 'hover:text-amber-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Upcoming</span>
                <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  New
                </span>
              </Link>

              {/* Music Events Link */}
              <Link
                to="/music"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/music')
                    ? 'bg-rose-50 text-rose-700 font-bold'
                    : 'hover:text-rose-600 hover:bg-slate-50'
                }`}
              >
                <Music className="w-3.5 h-3.5 text-rose-600" />
                Music & Concerts
              </Link>

              {/* Artists Link */}
              <Link
                to="/artists"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/artists')
                    ? 'bg-purple-50 text-purple-700 font-bold'
                    : 'hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5 text-purple-600" />
                Artists
              </Link>

              {/* Unified Discover Link */}
              <Link
                to="/search"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/search') && !location.search.includes('type=movies')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Explore All
              </Link>

              {/* Find Movie Tickets Near You */}
              <Link
                to="/tickets"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/tickets')
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-slate-50 text-slate-700 font-bold'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                Find Tickets
              </Link>

              {/* Feedback & Suggestions Link */}
              <Link
                to="/feedback"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/feedback')
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'hover:text-amber-600 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Feedback</span>
              </Link>
            </nav>

            {/* City Location Selector (Visual Pill that opens Indian Cities Modal) */}
            <button
              type="button"
              onClick={() => setIsCityModalOpen(true)}
              title="Click to change city (4,200+ Indian cities across all 36 States & UTs supported)"
              className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs group flex-shrink-0 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div className="flex items-baseline gap-1 text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                  {selectedCity}
                </span>
                {selectedState && (
                  <span className="text-[10px] text-slate-400 font-medium hidden lg:inline">
                    , {selectedState}
                  </span>
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 ml-0.5" />
            </button>

            {/* Share Website Button */}
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition-all shadow-2xs cursor-pointer flex-shrink-0"
              title="Share ZENKAI with friends and developers"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Unified Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs lg:max-w-sm hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search movies, concerts, artists, festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs lg:text-sm rounded-full bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                />
              </div>
            </form>

            {/* Account & Profile Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user?.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <span className="text-xs font-semibold text-slate-700 hidden lg:inline-block max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                      title="Admin Moderation Console"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openAuth('login')}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-xs shadow-indigo-200 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3">
            <form onSubmit={handleSearchSubmit} className="sm:hidden mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search movies, concerts, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/search?type=movies"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-700 font-semibold"
              >
                🎬 Movies Discovery
              </Link>
              <Link
                to="/upcoming"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-amber-50 text-amber-800 font-bold flex items-center justify-between"
              >
                <span>📅 Upcoming Movies</span>
                <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">New</span>
              </Link>
              <Link
                to="/music"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-rose-50 text-rose-700 font-semibold"
              >
                🎵 Concerts & Music
              </Link>
              <Link
                to="/artists"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-700 font-semibold"
              >
                🎤 Artists & Bands
              </Link>
              <Link
                to="/tickets"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 font-semibold"
              >
                🎟️ Find Tickets
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsCityModalOpen(true);
                }}
                className="p-2.5 rounded-xl hover:bg-indigo-50 text-slate-800 font-semibold text-left flex items-center justify-between col-span-2 border border-slate-100 bg-slate-50/60"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>
                    City: <strong className="text-indigo-700">{selectedCity}</strong>{' '}
                    {selectedState ? <span className="text-slate-400 font-normal">({selectedState})</span> : ''}
                  </span>
                </span>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/80 px-2 py-0.5 rounded-full">
                  Change
                </span>
              </button>
              <Link
                to="/feedback"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-1.5"
              >
                <span>💡 Feedback & Ideas</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setShareModalOpen(true);
                }}
                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-700 font-semibold text-left flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Website</span>
              </button>
              <Link
                to="/search"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 col-span-2"
              >
                🔍 Unified Search
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 font-bold text-indigo-600 col-span-2"
                >
                  My Profile, Watchlist & Saved Events
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      <CityModal />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
