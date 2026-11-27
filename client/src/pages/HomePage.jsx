import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Star,
  Calendar,
  ChevronRight,
  Bookmark,
  Sparkles,
  Film,
  Music,
  Mic2,
  Ticket,
  ArrowRight,
  Flame,
  MapPin,
  Building2,
} from 'lucide-react';
import api, { getCachedData } from '../services/api';
import { useCity } from '../context/CityContext';
import MovieCard from '../components/MovieCard';
import MusicEventCard from '../components/MusicEventCard';
import ArtistCard from '../components/ArtistCard';
import TrailerModal from '../components/TrailerModal';

const HomePage = () => {
  const { selectedCity, setIsCityModalOpen } = useCity();

  // Instant rehydration from client cache for zero-latency page refresh
  const initialMovieCache = getCachedData('/movies/discovery?{}');
  const initialMusicCache = getCachedData('/music/discovery?{}');

  const [movieSections, setMovieSections] = useState(
    initialMovieCache?.data || initialMovieCache || null
  );
  const [musicSections, setMusicSections] = useState(
    initialMusicCache?.data || initialMusicCache || null
  );
  const [loading, setLoading] = useState(!initialMovieCache && !initialMusicCache);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'movies', 'music'
  const [trailerModal, setTrailerModal] = useState({ open: false, key: '', title: '' });
  const [upcomingCategory, setUpcomingCategory] = useState('all');
  const [visibleUpcomingCount, setVisibleUpcomingCount] = useState(12);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // If data is already displayed from cache, don't show full-page loader
        if (!movieSections && !musicSections) {
          setLoading(true);
        }

        const [movieRes, musicRes] = await Promise.all([
          api.get('/movies/discovery'),
          api.get('/music/discovery'),
        ]);

        if (isMounted) {
          if (movieRes.data.success) setMovieSections(movieRes.data.data);
          if (musicRes.data.success) setMusicSections(musicRes.data.data);
        }
      } catch (err) {
        console.error('[Home Data Error]', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading && !movieSections) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-80 sm:h-96 rounded-3xl bg-slate-200" />
        {/* Quick Ticket Bar Skeleton */}
        <div className="h-24 rounded-2xl bg-slate-200" />
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-[2/3] rounded-xl bg-slate-200" />
          <div className="aspect-[2/3] rounded-xl bg-slate-200" />
          <div className="aspect-[2/3] rounded-xl bg-slate-200" />
          <div className="aspect-[2/3] rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const heroMovie = movieSections?.featured?.[0] || movieSections?.trending?.[0];
  const heroEvent = musicSections?.upcomingConcerts?.[0] || musicSections?.popularEvents?.[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Dynamic Category Switcher Pill Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              🍿 All Entertainment
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'movies'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:text-indigo-600'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Movies Only
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'music'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'hover:text-rose-600'
              }`}
            >
              <Music className="w-3.5 h-3.5" /> Music & Concerts
            </button>
          </div>

          <Link
            to="/search"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors hidden sm:flex"
          >
            <span>Explore All 2026/2027 Lineup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Dual Spotlight Banner */}
      {activeTab !== 'music' && heroMovie && (
        <div className="relative bg-slate-950 text-white overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.backdrop || heroMovie.poster}
              alt={heroMovie.title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                if (heroMovie.poster && e.target.src !== heroMovie.poster && !e.target.src.endsWith(heroMovie.poster)) {
                  e.target.src = heroMovie.poster;
                } else {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80';
                }
              }}
              className="w-full h-full object-cover object-center opacity-35 transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold backdrop-blur-md border border-indigo-400/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Featured Movie Spotlight
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {heroMovie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {heroMovie.ratingSummary?.averageAudienceRating || '9.0'} / 10
                </span>
                <span>{heroMovie.releaseYear || 2024}</span>
                <span>•</span>
                <span>{heroMovie.runtime} min</span>
                <span>•</span>
                <span className="text-slate-300">{heroMovie.genres?.join(', ')}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
                {heroMovie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/movie/${heroMovie.slug || heroMovie._id}`}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  View Details & Showtimes
                </Link>

                {heroMovie.trailers?.[0] && (
                  <button
                    onClick={() =>
                      setTrailerModal({
                        open: true,
                        key: heroMovie.trailers[0].youtubeKey,
                        title: heroMovie.title,
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If Music Only selected, show Music Spotlight Banner */}
      {activeTab === 'music' && heroEvent && (
        <div className="relative bg-slate-950 text-white overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <img
              src={heroEvent.banner || heroEvent.poster}
              alt={heroEvent.title}
              className="w-full h-full object-cover object-center opacity-40 transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold backdrop-blur-md border border-rose-400/20">
                <Music className="w-3.5 h-3.5 text-rose-400" />
                Featured Concert Spotlight
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {heroEvent.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="text-rose-400 font-bold">By {heroEvent.artistName}</span>
                <span>•</span>
                <span>{heroEvent.venue?.name}, {heroEvent.venue?.city}</span>
                <span>•</span>
                <span>
                  {new Date(heroEvent.eventDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
                {heroEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/music/${heroEvent.slug || heroEvent._id}`}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
                >
                  View Event & Tickets
                </Link>
                {heroEvent.ticketPricing?.[0]?.bookingUrl && (
                  <a
                    href={heroEvent.ticketPricing[0].bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
                  >
                    Book Official Tickets →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Homepage Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Find Movie Tickets Near You Spotlight */}
        {activeTab !== 'music' && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                <Ticket className="w-3 h-3" /> Live Cinema Theatres & Showtimes
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Find Movie Tickets Near You in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                  {selectedCity}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Check showtimes, IMAX & 4DX formats, seat pricing, and live availability at PVR INOX, Cinépolis, and top multiplexes near you.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedCity}</span>
                <span className="text-[10px] text-amber-400 font-normal underline ml-1">Switch City</span>
              </button>
              <Link
                to="/tickets"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                Find Tickets Now →
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 1: FEATURED MOVIES
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.featured?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Film className="w-4 h-4" /> Cinema Masterworks
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  1. Featured Movies
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Critically acclaimed releases and theatrical blockbusters
                </p>
              </div>
              <Link
                to="/search?type=movies"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {movieSections.featured.slice(0, 4).map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2: NOW SHOWING IN CINEMAS
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.nowShowing?.length > 0 && (
          <section className="bg-emerald-50/30 p-6 sm:p-8 rounded-3xl border border-emerald-200/60">
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <Ticket className="w-4 h-4 text-emerald-600" /> In Theatres Now
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>2. Now Showing in Cinemas</span>
                  <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {movieSections.nowShowing.length} Active Films
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirmed cinema showtimes across IMAX, 4DX, and multiplex screens in{' '}
                  <span className="font-semibold text-emerald-800">{selectedCity}</span> and major cities
                </p>
              </div>
              <Link
                to="/tickets"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                All Theatres in {selectedCity} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {movieSections.nowShowing.map((m) => (
                <MovieCard key={m._id} movie={m} selectedCity={selectedCity} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3: RELEASING SOON (NEXT 30 DAYS)
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.releasingSoon?.length > 0 && (
          <section className="bg-rose-50/40 p-6 sm:p-8 rounded-3xl border border-rose-200/60">
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4 text-rose-600" /> Arriving in Cinemas Soon
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>3. Releasing Soon (Next 30 Days)</span>
                  <span className="text-xs bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {movieSections.releasingSoon.length} Blockbusters
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theatrical premieres scheduled within the next 30 days with upcoming advance ticket bookings
                </p>
              </div>
              <Link
                to="/upcoming?category=releasing_soon"
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
              >
                View Releasing Soon <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {movieSections.releasingSoon.map((m) => (
                <MovieCard key={m._id} movie={m} selectedCity={selectedCity} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 4: UPCOMING THEATRICAL RELEASES (> 30 DAYS)
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.upcoming && (() => {
          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
          const in30Days = new Date(startOfToday.getTime() + 30 * 24 * 60 * 60 * 1000);

          // Base upcoming list: future theatrical releases strictly from startOfToday onward
          const rawUpcoming = (movieSections.upcoming || []).filter((m) => {
            if (!m.releaseDate) return false;
            const d = new Date(m.releaseDate);
            return !isNaN(d.getTime()) && d >= startOfToday;
          });

          if (rawUpcoming.length === 0) return null;

          const year2026List = rawUpcoming.filter((m) => {
            const d = new Date(m.releaseDate);
            return d.getFullYear() === 2026;
          });
          const year2027List = rawUpcoming.filter((m) => {
            const d = new Date(m.releaseDate);
            return d.getFullYear() === 2027;
          });
          const year2028PlusList = rawUpcoming.filter((m) => {
            const d = new Date(m.releaseDate);
            return d.getFullYear() >= 2028;
          });
          const bollywoodList = rawUpcoming.filter((m) => m.industry === 'bollywood');
          const hollywoodList = rawUpcoming.filter((m) => m.industry === 'hollywood');
          const southIndianList = rawUpcoming.filter((m) => m.industry === 'south_indian');
          const internationalList = rawUpcoming.filter(
            (m) => m.industry === 'anime' || (m.country && m.country !== 'India' && m.country !== 'United States')
          );

          // Dynamic categories: only show when matching movie data exists
          const dynamicCategories = [
            { id: 'all', label: 'All Upcoming', count: rawUpcoming.length },
            ...(year2026List.length > 0 ? [{ id: '2026', label: 'Upcoming in 2026', count: year2026List.length }] : []),
            ...(year2027List.length > 0 ? [{ id: '2027', label: 'Coming in 2027', count: year2027List.length }] : []),
            ...(year2028PlusList.length > 0 ? [{ id: '2028_plus', label: 'Upcoming in 2028 & Beyond', count: year2028PlusList.length }] : []),
            ...(bollywoodList.length > 0 ? [{ id: 'bollywood', label: 'Bollywood Upcoming', count: bollywoodList.length }] : []),
            ...(hollywoodList.length > 0 ? [{ id: 'hollywood', label: 'Hollywood Upcoming', count: hollywoodList.length }] : []),
            ...(southIndianList.length > 0 ? [{ id: 'south_indian', label: 'South Indian Upcoming', count: southIndianList.length }] : []),
            ...(internationalList.length > 0 ? [{ id: 'international', label: 'International / Anime', count: internationalList.length }] : []),
          ];

          let filteredList = rawUpcoming;
          if (upcomingCategory === '2026') filteredList = year2026List;
          else if (upcomingCategory === '2027') filteredList = year2027List;
          else if (upcomingCategory === '2028_plus') filteredList = year2028PlusList;
          else if (upcomingCategory === 'bollywood') filteredList = bollywoodList;
          else if (upcomingCategory === 'hollywood') filteredList = hollywoodList;
          else if (upcomingCategory === 'south_indian') filteredList = southIndianList;
          else if (upcomingCategory === 'international') filteredList = internationalList;

          const displayedList = filteredList.slice(0, visibleUpcomingCount);

          return (
            <section className="bg-amber-50/40 p-6 sm:p-8 rounded-3xl border border-amber-200/70 space-y-6">
              {/* Header and View All CTA */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4 text-amber-600" /> Confirmed Theatrical Calendar
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>4. Upcoming Movie Releases</span>
                    <span className="text-xs bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {rawUpcoming.length} Verified Titles
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                    Strictly genuine upcoming releases scheduled for 2026, 2027, and 2028+. Old and past releases are strictly excluded.
                  </p>
                </div>
                <Link
                  to="/upcoming"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm w-fit flex-shrink-0"
                >
                  <span>View All Upcoming ({rawUpcoming.length}+)</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Dynamic Categories Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
                {dynamicCategories.map((cat) => {
                  const isSelected = upcomingCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setUpcomingCategory(cat.id);
                        setVisibleUpcomingCount(12);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold flex-shrink-0 transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-white hover:bg-amber-100/70 text-slate-700 border border-amber-200/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Movies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedList.map((m) => (
                  <MovieCard key={m._id || m.slug} movie={m} selectedCity={selectedCity} />
                ))}
              </div>

              {/* Load More Button & View All Link */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/60">
                <span className="text-xs text-amber-950 font-medium">
                  Showing <strong>{displayedList.length}</strong> of <strong>{filteredList.length}</strong> upcoming releases in this category
                </span>

                <div className="flex items-center gap-3">
                  {visibleUpcomingCount < filteredList.length && (
                    <button
                      onClick={() => setVisibleUpcomingCount((prev) => prev + 8)}
                      className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-slate-900 text-xs font-bold transition-colors shadow-2xs"
                    >
                      Load More Movies (+8)
                    </button>
                  )}
                  <Link
                    to="/upcoming"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>Browse Complete Roster</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })()}

        {/* =========================================================================
            SECTION 5: COMING IN 2027 (Dedicated Theatrical Blockbuster Showcase)
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.comingIn2027?.length > 0 && (
          <section className="bg-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900 shadow-xl">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-300" /> Dedicated 2027 Cinema Slate
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>5. Coming in 2027</span>
                  <span className="text-xs bg-indigo-500 text-white font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {movieSections.comingIn2027.length} Confirmed Releases
                  </span>
                </h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                  Highly anticipated franchise continuations, tentpoles, and theatrical event films confirmed for 2027 premiere
                </p>
              </div>
              <Link
                to="/upcoming?category=2027"
                className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-0.5 transition-colors"
              >
                All 2027 Films <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {movieSections.comingIn2027.slice(0, 8).map((m) => (
                <MovieCard key={m._id} movie={m} selectedCity={selectedCity} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 6: TRENDING MOVIES
        ========================================================================= */}
        {activeTab !== 'music' && movieSections?.trending?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4" /> Viral Sensations
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  6. Trending Theatrical Movies
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highest engagement, reviews, and audience conversation right now
                </p>
              </div>
              <Link
                to="/search?type=movies"
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
              >
                Explore Trending <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {movieSections.trending.slice(0, 4).map((m) => (
                <MovieCard key={m._id} movie={m} selectedCity={selectedCity} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            MUSIC EVENTS SECTIONS HEADER (Visual Distinction Divider)
        ========================================================================= */}
        {activeTab !== 'movies' && (
          <div className="pt-6 border-t-2 border-dashed border-rose-200">
            <div className="flex items-center justify-between p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 border border-rose-100 mb-8">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-white rounded-2xl shadow-xs text-2xl">🎵</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Live Music, Concerts & Stadium Tours
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Discover stadium concerts, multi-day music festivals, and verified ticket bookings
                  </p>
                </div>
              </div>

              <Link
                to="/music"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Music Hub <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: UPCOMING CONCERTS
        ========================================================================= */}
        {activeTab !== 'movies' && musicSections?.upcomingConcerts?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Mic2 className="w-4 h-4" /> Arena & Stadium Shows
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  5. Upcoming Concerts
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live performances by global and Indian headliners with official ticket links
                </p>
              </div>
              <Link
                to="/music?type=concert"
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
              >
                All Concerts <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicSections.upcomingConcerts.slice(0, 3).map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Happening Soon & This Month Section */}
        {activeTab !== 'movies' && (musicSections?.thisMonth?.length > 0 || musicSections?.happeningSoon?.length > 0) && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                  ⚡ Live Soon & This Month
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Concerts Happening This Month
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live shows and gigs scheduled over the next few days and weeks
                </p>
              </div>
              <Link
                to="/music?category=this_month"
                className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
              >
                View This Month <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(musicSections.thisMonth?.length > 0 ? musicSections.thisMonth : musicSections.happeningSoon).slice(0, 3).map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 6: POPULAR MUSIC EVENTS
        ========================================================================= */}
        {activeTab !== 'movies' && musicSections?.popularEvents?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4" /> Fast-Selling Lineups
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  6. Popular Music Events
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Most anticipated concerts and live tours trending among music lovers
                </p>
              </div>
              <Link
                to="/music?sortBy=popular"
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
              >
                View Popular <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicSections.popularEvents.slice(0, 3).map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 7: MUSIC FESTIVALS
        ========================================================================= */}
        {activeTab !== 'movies' && musicSections?.musicFestivals?.length > 0 && (
          <section className="bg-gradient-to-br from-rose-50/50 via-amber-50/40 to-purple-50/50 p-6 sm:p-8 rounded-3xl border border-rose-100">
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
                  ⛺ Multi-Day Experience
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  7. Music Festivals
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Multi-stage weekend festivals featuring international acts, electronic music, and food parks
                </p>
              </div>
              <Link
                to="/music?eventType=festival"
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-0.5"
              >
                All Festivals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {musicSections.musicFestivals.map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Indian Music Events & Stadium Tours */}
        {activeTab !== 'movies' && musicSections?.indianMusicEvents?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
                  🇮🇳 Indian Stadium & Arena Tours
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Indian Music Events & Tours
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Concerts across Mumbai, Delhi, Bengaluru, Ahmedabad, Chennai, and other Indian cities
                </p>
              </div>
              <Link
                to="/music?category=indian"
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-0.5"
              >
                All Indian Shows <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicSections.indianMusicEvents.slice(0, 3).map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 8: FEATURED ARTISTS
        ========================================================================= */}
        {activeTab !== 'movies' && musicSections?.featuredArtists?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                  <Mic2 className="w-4 h-4" /> Spotlight Performers
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  8. Featured Artists & Musicians
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore top tracks, tour dates, and concert schedules by your favourite musicians
                </p>
              </div>
              <Link
                to="/artists"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                All Artists <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {musicSections.featuredArtists.map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 9: RECENTLY ANNOUNCED EVENTS
        ========================================================================= */}
        {activeTab !== 'movies' && musicSections?.recentlyAnnounced?.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                  🆕 Fresh Tour Dates
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  9. Recently Announced Events
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Newly confirmed concert stops and early-bird ticket bookings
                </p>
              </div>
              <Link
                to="/music?sortBy=date_asc"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
              >
                View Latest <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicSections.recentlyAnnounced.slice(0, 3).map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.open}
        youtubeKey={trailerModal.key}
        title={trailerModal.title}
        onClose={() => setTrailerModal({ open: false, key: '', title: '' })}
      />
    </div>
  );
};

export default HomePage;
