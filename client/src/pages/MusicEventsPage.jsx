import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Music, Filter, RotateCcw, SlidersHorizontal, MapPin, Calendar, Sparkles } from 'lucide-react';
import api from '../services/api';
import MusicEventCard from '../components/MusicEventCard';

const GENRES = [
  'All',
  'Rock',
  'Pop',
  'Alternative Rock',
  'Punjabi Pop',
  'Electronic/EDM',
  'Sufi',
  'Bollywood',
  'Hip-Hop',
  'Classical',
  'Dance Pop',
];

const CITIES = [
  'All',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Ahmedabad',
  'Goa',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai',
  'Lucknow',
  'Singapore',
  'Tokyo',
  'London',
];

const CONCERT_CATEGORIES = [
  { label: 'Upcoming Concerts', value: 'upcoming', icon: '🎵' },
  { label: 'Happening Soon', value: 'happening_soon', icon: '⚡' },
  { label: 'This Month', value: 'this_month', icon: '📅' },
  { label: 'Next Month', value: 'next_month', icon: '🗓️' },
  { label: 'Music Festivals', value: 'festivals', icon: '🎪' },
  { label: 'Live Music Events', value: 'live_gigs', icon: '🎸' },
  { label: 'International Concerts', value: 'international', icon: '🌍' },
  { label: 'Indian Music Events', value: 'indian', icon: '🇮🇳' },
  { label: 'Recently Announced', value: 'recently_announced', icon: '📢' },
];

const EVENT_TYPES = [
  { label: 'All Formats', value: 'All' },
  { label: 'Stadium & Arena Concerts', value: 'concert' },
  { label: 'Music Festivals', value: 'festival' },
  { label: 'Artist World Tours', value: 'tour' },
  { label: 'Live Gigs & Intimate Shows', value: 'live_gig' },
];

const MusicEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || 'upcoming');
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [eventType, setEventType] = useState(searchParams.get('eventType') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date_asc');

  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [category, q, genre, city, eventType, status, minPrice, maxPrice, sortBy]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'all') params.category = category;
      if (q) params.q = q;
      if (genre && genre !== 'All') params.genre = genre;
      if (city && city !== 'All') params.city = city;
      if (eventType && eventType !== 'All') params.eventType = eventType;
      if (status && status !== 'All') params.status = status;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      if (genre && genre !== 'All') params.genre = genre;
      if (city && city !== 'All') params.city = city;
      if (eventType && eventType !== 'All') params.eventType = eventType;
      if (status && status !== 'All') params.status = status;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/music/events', { params });
      if (res.data.success) {
        setEvents(res.data.events);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('[Music Events Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQ('');
    setGenre('All');
    setCity('All');
    setEventType('All');
    setStatus('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('date_asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Navigation */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2 border border-rose-100">
          <Music className="w-3.5 h-3.5" />
          Live Concerts & Festivals Hub
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          🎵 Discover Music Events & Artist Tours
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Find upcoming concerts, multi-day music festivals, artist tour dates, and verified ticket bookings across India and global stops.
        </p>
      </div>

      {/* Dedicated Concert Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CONCERT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
              category === cat.value
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-rose-600" /> Event Filters
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Format */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              {EVENT_TYPES.map((et) => (
                <option key={et.value} value={et.value}>{et.label}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / Region</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Music Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Max Ticket Price (₹)</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="3000">Under ₹3,000</option>
              <option value="5000">Under ₹5,000</option>
              <option value="10000">Under ₹10,000</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="date_asc">Event Date (Earliest)</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Showing <span className="text-rose-600 font-bold">{events.length}</span> verified concerts & festivals
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400">Loading music event schedules...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <p className="text-3xl mb-2">🎸</p>
          <h3 className="text-base font-bold text-slate-900 mb-1">No music events match your criteria</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try resetting your city or genre filter to view all upcoming concerts and festival dates.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <MusicEventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicEventsPage;
