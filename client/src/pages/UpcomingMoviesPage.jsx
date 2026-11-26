import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Search,
  Filter,
  Play,
  Clock,
  Star,
  Users,
  Film,
  ChevronRight,
  ArrowUpDown,
  Bell,
  CheckCircle,
  Ticket,
  ChevronDown,
  Globe,
  Loader2,
} from 'lucide-react';
import api, { getCachedData } from '../services/api';
import MoviePoster from '../components/MoviePoster';
import TrailerModal from '../components/TrailerModal';

const UpcomingMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Instant rehydration from client cache for zero loading lag on page refresh
  const initialCache = getCachedData(
    '/movies/upcoming?{"category":"all","genre":"All","language":"All","limit":12,"page":1,"sortBy":"releaseDate_asc"}'
  );

  const [movies, setMovies] = useState(initialCache?.movies || []);
  const [loading, setLoading] = useState(!initialCache);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialCache?.hasMore || false);
  const [total, setTotal] = useState(initialCache?.total || 0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'releaseDate_asc');

  // Dynamic Metadata from Server
  const [categories, setCategories] = useState(initialCache?.categories || []);
  const [availableGenres, setAvailableGenres] = useState(initialCache?.availableGenres || []);
  const [availableLanguages, setAvailableLanguages] = useState(initialCache?.availableLanguages || []);

  // Modals & Notifications
  const [trailerModal, setTrailerModal] = useState({ open: false, key: '', title: '' });
  const [notifiedSlugs, setNotifiedSlugs] = useState({});

  useEffect(() => {
    setPage(1);
    fetchUpcomingMovies(1, false);
  }, [selectedCategory, selectedGenre, selectedLanguage, sortBy]);

  const fetchUpcomingMovies = async (pageNum = 1, append = false, query = searchQuery) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError('');

      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 12);
      if (query && query.trim()) params.append('q', query.trim());
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (selectedLanguage && selectedLanguage !== 'All') params.append('language', selectedLanguage);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/movies/upcoming?${params.toString()}`);
      if (res.data.success) {
        const fetchedMovies = res.data.movies || [];

        // STRICT FRONTEND SANITIZATION:
        // Exclude any movie released in 2025 or earlier, or whose release date is before today
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const validFutureMovies = fetchedMovies.filter((m) => {
          if (!m.releaseDate) return false;
          const d = new Date(m.releaseDate);
          return !isNaN(d.getTime()) && d >= startOfToday;
        });

        if (append) {
          setMovies((prev) => {
            const seen = new Set(prev.map((p) => p._id || p.slug));
            const newUnique = validFutureMovies.filter((m) => !seen.has(m._id || m.slug));
            return [...prev, ...newUnique];
          });
        } else {
          setMovies(validFutureMovies);
        }

        setTotal(res.data.total || validFutureMovies.length);
        setHasMore(res.data.hasMore || (pageNum * 12 < res.data.total));
        setPage(pageNum);

        if (res.data.categories?.length) {
          setCategories(res.data.categories);
        }
        if (res.data.availableGenres) setAvailableGenres(res.data.availableGenres);
        if (res.data.availableLanguages) setAvailableLanguages(res.data.availableLanguages);
      }
    } catch (err) {
      console.error('[Upcoming Movies Fetch Error]', err);
      setError('Unable to fetch upcoming movie schedules. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUpcomingMovies(1, false, searchQuery);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchUpcomingMovies(page + 1, true);
    }
  };

  const toggleNotify = (slug) => {
    setNotifiedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const formatReleaseCountdown = (dateString) => {
    if (!dateString) return 'Release Date TBA';
    const release = new Date(dateString);
    const now = new Date();
    const diffTime = release - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Premieres This Week';
    if (diffDays <= 30) return `In ${diffDays} days`;
    const diffMonths = Math.round(diffDays / 30.4);
    if (diffMonths <= 12) return `In ${diffMonths} months`;
    return `${release.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white pt-10 pb-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Upcoming Theatrical Releases
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Genuine Upcoming Movies &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">
                  Premiere Calendar
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                Explore confirmed theatrical release dates, cast rosters with photos, high-res posters, official teasers, and advance ticket booking alerts for upcoming Bollywood, Hollywood, South Indian, and Anime blockbusters scheduled for 2026, 2027, and beyond.
              </p>
            </div>

            {/* Quick Stats Pill Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left flex-shrink-0">
              <div>
                <p className="text-2xl font-black text-amber-400">{total || movies.length}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Upcoming Films Listed</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20" />
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Future Releases Only</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search upcoming movies by title, director, or cast member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Dynamic Categories Bar (Only rendered when matching data is available) */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category Pills (Dynamic from API) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 shadow-2xs'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-2 text-xs w-full lg:w-auto">
              {/* Genre Filter */}
              {availableGenres.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Genres</option>
                    {availableGenres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Language Filter */}
              {availableLanguages.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200">
                  <Film className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Languages</option>
                    {availableLanguages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort By Filter */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="releaseDate_asc">Release Date: Earliest First</option>
                  <option value="releaseDate_desc">Release Date: Latest First</option>
                  <option value="popularity">Most Anticipated</option>
                  <option value="title_asc">Title (A - Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Movie Roster Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-5">
                <div className="w-48 aspect-[2/3] bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-16 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error && movies.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-200 text-sm mb-4">
              {error}
            </div>
            <button
              onClick={() => fetchUpcomingMovies(1, false)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No genuine upcoming movies found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting your category filter, genre, or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setSearchQuery('');
                fetchUpcomingMovies(1, false, '');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing <strong className="text-slate-900">{movies.length}</strong> of{' '}
                <strong className="text-slate-900">{total}</strong> Genuine Upcoming Titles
              </p>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                ✓ Future Releases Only (2026, 2027, 2028+)
              </span>
            </div>

            {/* Grid of Upcoming Movie Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {movies.map((movie) => {
                const releaseDateObj = movie.releaseDate ? new Date(movie.releaseDate) : null;
                const releaseDateFormatted = releaseDateObj
                  ? releaseDateObj.toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Date TBA';
                const countdown = formatReleaseCountdown(movie.releaseDate);
                const isNotified = notifiedSlugs[movie.slug];

                return (
                  <article
                    key={movie._id || movie.slug}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
                  >
                    {/* Poster + Trailer Trigger */}
                    <div className="sm:w-52 relative flex-shrink-0 bg-slate-100 aspect-[2/3] sm:aspect-auto">
                      <MoviePoster
                        src={movie.poster}
                        alt={movie.title}
                        aspectRatio="aspect-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Release Countdown Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {countdown}
                        </span>
                      </div>

                      {/* Play Trailer Overlay */}
                      {movie.trailers?.[0] && (
                        <button
                          onClick={() =>
                            setTrailerModal({
                              open: true,
                              key: movie.trailers[0].youtubeKey,
                              title: movie.title,
                            })
                          }
                          className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white font-bold text-xs"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </div>
                          <span>Watch Teaser</span>
                        </button>
                      )}
                    </div>

                    {/* Movie Info & Details */}
                    <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                      <div>
                        {/* Meta Tags: Industry, Year, Languages */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {movie.industry ? movie.industry.replace('_', ' ') : 'Cinema'}
                          </span>
                          <span>•</span>
                          <span>{movie.languages?.slice(0, 2).join(', ') || 'Original'}</span>
                          {movie.certification && (
                            <>
                              <span>•</span>
                              <span className="border border-slate-200 px-1 rounded text-[10px] text-slate-600">
                                {movie.certification}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <Link
                          to={`/movie/${movie.slug || movie._id}`}
                          className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                          {movie.title}
                        </Link>

                        {/* Premiere Date Banner */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-fit mt-1.5 border border-amber-200/60">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Premiere: {releaseDateFormatted}</span>
                        </div>

                        {/* Synopsis */}
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {movie.overview || movie.tagline || 'Experience this anticipated cinematic event coming soon to theatres.'}
                        </p>

                        {/* Movie Director info (Text only - cast photos appear exclusively on movie details page) */}
                        {movie.director && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span className="text-slate-400">Director:</span>
                            <span className="font-semibold text-slate-800">{movie.director}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Bottom CTA & Booking Notice */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Notify Me / Advance Booking Button */}
                        <button
                          onClick={() => toggleNotify(movie.slug)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isNotified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isNotified ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Alert Set for Booking</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-slate-500" />
                              <span>Notify When Tickets Open</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          {movie.trailers?.[0] && (
                            <button
                              onClick={() =>
                                setTrailerModal({
                                  open: true,
                                  key: movie.trailers[0].youtubeKey,
                                  title: movie.title,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-amber-700" />
                              <span>Trailer</span>
                            </button>
                          )}
                          <Link
                            to={`/movie/${movie.slug || movie._id}`}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span>Full Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination / Load More Handler */}
            {hasMore && (
              <div className="pt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Loading More Releases...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Upcoming Movies ({total - movies.length} remaining)</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.open}
        onClose={() => setTrailerModal({ open: false, key: '', title: '' })}
        youtubeKey={trailerModal.key}
        title={trailerModal.title}
      />
    </div>
  );
};

export default UpcomingMoviesPage;
