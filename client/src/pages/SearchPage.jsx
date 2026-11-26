import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, SlidersHorizontal, Film, Music, Mic2, MapPin } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import MusicEventCard from '../components/MusicEventCard';
import ArtistCard from '../components/ArtistCard';

const GENRES = [
  'All',
  'Action',
  'Drama',
  'Science Fiction',
  'Animation',
  'Rock',
  'Pop',
  'Alternative Rock',
  'Punjabi Pop',
  'Electronic/EDM',
  'Sufi',
  'Bollywood',
];

const CITIES = [
  'All',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Goa',
];
const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Japanese'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all'); // 'all', 'movies', 'music', 'artists'
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'all');
  const [language, setLanguage] = useState(searchParams.get('language') || 'all');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const [data, setData] = useState({
    movies: [],
    events: [],
    artists: [],
    totalMovies: 0,
    totalEvents: 0,
    totalArtists: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setType(searchParams.get('type') || 'all');
    setStatus(searchParams.get('status') || 'all');
    setCity(searchParams.get('city') || 'all');
    setGenre(searchParams.get('genre') || 'all');
    setLanguage(searchParams.get('language') || 'all');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchUnifiedSearch();
  }, [q, type, status, city, genre, language, maxPrice]);

  const fetchUnifiedSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.q = q;
      if (type) params.type = type;
      if (status && status !== 'all') params.status = status;
      if (city && city !== 'all') params.city = city;
      if (genre && genre !== 'all') params.genre = genre;
      if (language && language !== 'all') params.language = language;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/search/unified', { params });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('[Unified Search Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setQ('');
    setType('all');
    setStatus('all');
    setCity('all');
    setGenre('all');
    setLanguage('all');
    setMaxPrice('');
    setSearchParams({});
  };

  const totalResults =
    (data.movies?.length || 0) + (data.events?.length || 0) + (data.artists?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          🍿 Unified Entertainment Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Search across Movies, Live Concerts, Music Festivals, Performing Artists, Venues, and Cities.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by movie title, concert, festival, artist name, venue, or city..."
          className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-2xl bg-white border border-slate-200 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Scope Switcher: All, Movies, Music Events, Artists */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setType('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            type === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Entertainment ({totalResults})
        </button>

        <button
          onClick={() => setType('movies')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            type === 'movies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          Movies ({data.movies?.length || 0})
        </button>

        <button
          onClick={() => setType('music')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            type === 'music'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          Music & Concerts ({data.events?.length || 0})
        </button>

        <button
          onClick={() => setType('artists')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            type === 'artists'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mic2 className="w-4 h-4" />
          Artists ({data.artists?.length || 0})
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Advanced Attribute Filters
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Status / Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Theatrical Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All Theatrical Releases</option>
              <option value="now_showing">Now Showing in Cinemas</option>
              <option value="releasing_soon">Releasing Soon (Next 30 Days)</option>
              <option value="upcoming">Upcoming Releases (&gt; 30 Days)</option>
              <option value="coming_2027">Coming in 2027</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / Location</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Max Price</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="500">Under ₹500 (Cinema)</option>
              <option value="3000">Under ₹3,000</option>
              <option value="7000">Under ₹7,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400">Searching movies, concerts, and performers...</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="text-base font-bold text-slate-900 mb-1">No matching results found</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try broadening your search term or reset filters to see all available movies and music events.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Artists Section if present */}
          {(type === 'all' || type === 'artists') && data.artists?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-purple-600" /> Matching Artists & Musicians ({data.artists.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data.artists.map((artist) => (
                  <ArtistCard key={artist._id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Music Events Section if present */}
          {(type === 'all' || type === 'music') && data.events?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-600" /> Concerts & Music Events ({data.events.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.events.map((event) => (
                  <MusicEventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Movies Section if present */}
          {(type === 'all' || type === 'movies') && data.movies?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-600" /> Movies & Films ({data.movies.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {data.movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
