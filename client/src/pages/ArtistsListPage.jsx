import React, { useState, useEffect } from 'react';
import { Mic2, Search, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import ArtistCard from '../components/ArtistCard';

const GENRES = [
  'All',
  'Rock',
  'Pop',
  'Alternative Rock',
  'Punjabi Pop',
  'Dance Pop',
  'Sufi',
  'Film Score',
  'Bollywood',
  'EDM',
  'Indie Folk',
];

const ARTIST_CATEGORIES = [
  { label: 'All Artists', value: 'All', icon: '🎤' },
  { label: 'Indian Singers', value: 'indian_singer', icon: '🇮🇳' },
  { label: 'International Stars', value: 'international_singer', icon: '🌍' },
  { label: 'Bands & Groups', value: 'band', icon: '🎸' },
  { label: 'DJs & Electronic', value: 'dj_electronic', icon: '🎧' },
  { label: 'Indie Performers', value: 'indie', icon: '✨' },
];

const ArtistsListPage = () => {
  const [artists, setArtists] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, [q, category, genre]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const params = {};
      if (q) params.q = q;
      if (category && category !== 'All') params.category = category;
      if (genre && genre !== 'All') params.genre = genre;

      const res = await api.get('/artists', { params });
      if (res.data.success) {
        setArtists(res.data.artists);
      }
    } catch (err) {
      console.error('[Artists Error]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2 border border-purple-100">
          <Mic2 className="w-3.5 h-3.5" />
          Musicians & Bands Directory
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          🎤 Explore Artists & Performers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Discover verified profiles of popular Indian singers, international stars, iconic bands, electronic DJs, and breakthrough indie acts.
        </p>
      </div>

      {/* Artist Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ARTIST_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
              category === cat.value
                ? 'bg-purple-600 text-white shadow-purple-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search artists by name..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 flex-shrink-0">Genre:</span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                genre === g
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400">Loading musicians...</p>
        </div>
      ) : artists.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
          <p className="text-3xl mb-2">🎤</p>
          <h3 className="text-sm font-bold text-slate-800">No artists match your search</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistsListPage;
