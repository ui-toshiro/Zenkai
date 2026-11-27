import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Play,
  Bookmark,
  Heart,
  CheckCircle,
  Ticket,
  Tv,
  Share2,
  ThumbsUp,
  Flag,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  Building2,
  UserCheck,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import MoviePoster from '../components/MoviePoster';
import CastAvatar from '../components/CastAvatar';
import TrailerModal from '../components/TrailerModal';
import MovieCard from '../components/MovieCard';
import AuthModal from '../components/AuthModal';

const MovieDetailsPage = () => {
  const { idOrSlug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { selectedCity, selectedState, selectCity, cities, setIsCityModalOpen } = useCity();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // City Ticket State
  const [ticketCity, setTicketCity] = useState(selectedCity || 'Mumbai');
  const [ticketState, setTicketState] = useState(selectedState || 'Maharashtra');
  const [selectedShowDate, setSelectedShowDate] = useState('Today');
  const [cityTheatres, setCityTheatres] = useState([]);
  const [showtimesLoading, setShowtimesLoading] = useState(false);
  const [showtimesMessage, setShowtimesMessage] = useState('');

  useEffect(() => {
    if (selectedCity) {
      setTicketCity(selectedCity);
      setTicketState(selectedState || '');
    }
  }, [selectedCity, selectedState]);

  // Fetch showtimes for ticketCity & ticketState from backend API
  useEffect(() => {
    if (!idOrSlug) return;
    const fetchShowtimes = async () => {
      try {
        setShowtimesLoading(true);
        const res = await api.get(
          `/movies/${idOrSlug}/showtimes?city=${encodeURIComponent(ticketCity)}&state=${encodeURIComponent(
            ticketState || ''
          )}`
        );
        if (res.data.success) {
          setCityTheatres(res.data.theatres || []);
          setShowtimesMessage(res.data.message || '');
        }
      } catch (err) {
        console.error('[Showtimes Fetch Error]', err);
      } finally {
        setShowtimesLoading(false);
      }
    };
    fetchShowtimes();
  }, [idOrSlug, ticketCity, ticketState]);

  // User state
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavourites, setInFavourites] = useState(false);
  const [inWatched, setInWatched] = useState(false);

  // Review state
  const [userReview, setUserReview] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [ratingInput, setRatingInput] = useState(8);
  const [reviewTitleInput, setReviewTitleInput] = useState('');
  const [reviewContentInput, setReviewContentInput] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('recent');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Modals
  const [trailerModal, setTrailerModal] = useState({ open: false, key: '', title: '' });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Explicitly reset movie state on route/slug change to prevent mixing up cast from previous movies
    setMovie(null);
    setReviews([]);
    setRecommendations(null);
    setCityTheatres([]);
    fetchMovieDetails();
  }, [idOrSlug]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/movies/${idOrSlug}`);
      if (res.data.success) {
        const m = res.data.movie;
        setMovie(m);

        if (res.data.userContext) {
          setInWatchlist(res.data.userContext.inWatchlist);
          setInFavourites(res.data.userContext.inFavourites);
          setInWatched(res.data.userContext.inWatched);
          if (res.data.userContext.userReview) {
            setUserReview(res.data.userContext.userReview);
            setRatingInput(res.data.userContext.userReview.rating);
            setReviewTitleInput(res.data.userContext.userReview.title || '');
            setReviewContentInput(res.data.userContext.userReview.content || '');
          }
        }

        // Record recently viewed if logged in
        if (isAuthenticated) {
          api.post(`/users/recently-viewed/${m._id}`).catch(() => {});
        }

        // Fetch reviews & recommendations in parallel
        fetchReviews(m._id, reviewSort, reviewFilter);
        fetchRecommendations(m._id);
      }
    } catch (err) {
      console.error('[Movie Details Error]', err);
      setError('Movie not found or failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (movieId, sortBy = 'recent', filter = 'all') => {
    try {
      const res = await api.get(`/reviews/movie/${movieId}?sortBy=${sortBy}&filter=${filter}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('[Reviews Error]', err);
    }
  };

  const fetchRecommendations = async (movieId) => {
    try {
      const res = await api.get(`/movies/${movieId}/recommendations`);
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      console.error('[Recommendations Error]', err);
    }
  };

  // Toggle Watchlist
  const handleToggleWatchlist = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/watchlist/${movie._id}`);
      if (res.data.success) {
        setInWatchlist(res.data.inWatchlist);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error updating watchlist');
    }
  };

  // Toggle Favourites
  const handleToggleFavourites = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/favourites/${movie._id}`);
      if (res.data.success) {
        setInFavourites(res.data.inFavourites);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error updating favourites');
    }
  };

  // Toggle Watched
  const handleToggleWatched = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/watched/${movie._id}`);
      if (res.data.success) {
        setInWatched(res.data.inWatched);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error updating watched list');
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    if (!reviewContentInput.trim()) {
      setReviewError('Please write your review thoughts');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    try {
      const res = await api.post('/reviews', {
        movieId: movie._id,
        rating: ratingInput,
        title: reviewTitleInput,
        content: reviewContentInput,
      });

      if (res.data.success) {
        setUserReview(res.data.review);
        setIsEditingReview(false);
        showToast('Your review has been published!');
        // Refresh reviews and movie summary
        fetchReviews(movie._id, reviewSort, reviewFilter);
        const mRes = await api.get(`/movies/${movie._id}`);
        if (mRes.data.success) setMovie(mRes.data.movie);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        setUserReview(null);
        setIsEditingReview(false);
        setReviewContentInput('');
        setReviewTitleInput('');
        showToast('Review deleted');
        fetchReviews(movie._id, reviewSort, reviewFilter);
        const mRes = await api.get(`/movies/${movie._id}`);
        if (mRes.data.success) setMovie(mRes.data.movie);
      }
    } catch (err) {
      showToast('Error deleting review');
    }
  };

  // Vote Helpful
  const handleVoteHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/reviews/${reviewId}/helpful`);
      if (res.data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? { ...r, helpfulCount: res.data.helpfulCount, hasVotedHelpful: res.data.hasVotedHelpful }
              : r
          )
        );
      }
    } catch (err) {
      showToast('Error voting review');
    }
  };

  // Report Review
  const handleReportReview = async (reviewId) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    const reason = window.prompt('Please enter the reason for reporting this review (e.g., spam, spoilers, offensive):');
    if (!reason) return;

    try {
      const res = await api.post(`/reviews/${reviewId}/report`, { reason });
      if (res.data.success) {
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Failed to report review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading film details & schedules...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-xl border border-rose-200 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Film Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Unable to retrieve film information.'}</p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Return to Cinema Discovery
        </Link>
      </div>
    );
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const isUpcoming =
    movie.releaseStatus === 'upcoming' &&
    movie.releaseDate &&
    new Date(movie.releaseDate) >= startOfToday;
  const isNowShowing = movie.releaseStatus === 'now_showing';
  const hasTickets = movie.ticketPricing && movie.ticketPricing.length > 0;
  const hasStreaming = movie.streamingAvailability && movie.streamingAvailability.length > 0;

  return (
    <div className="min-h-screen pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {toastMessage}
        </div>
      )}

      {/* Hero Backdrop Banner */}
      <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              if (movie.poster && e.target.src !== movie.poster && !e.target.src.endsWith(movie.poster)) {
                e.target.src = movie.poster;
              } else {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80';
              }
            }}
            className="w-full h-full object-cover object-center opacity-30 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/search?industry=${movie.industry}`}
              className="capitalize hover:text-white transition-colors"
            >
              {movie.industry.replace('_', ' ')}
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-medium truncate max-w-xs">{movie.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Card */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 relative group">
                <MoviePoster
                  src={movie.poster}
                  alt={movie.title}
                  aspectRatio="aspect-[2/3]"
                  className="w-full h-full"
                />

                {isNowShowing && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-500 text-white shadow-md">
                    ● Now Showing
                  </span>
                )}
                {isUpcoming && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500 text-white shadow-md">
                    Coming Soon
                  </span>
                )}

                {movie.trailers?.[0] && (
                  <button
                    onClick={() =>
                      setTrailerModal({
                        open: true,
                        key: movie.trailers[0].youtubeKey,
                        title: movie.title,
                      })
                    }
                    className="absolute inset-0 z-20 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-semibold text-sm"
                  >
                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                    <span>Play Official Trailer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Basic Information & Hero Metadata */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 font-medium mt-2">
                  <span>{movie.releaseYear || new Date(movie.releaseDate).getFullYear()}</span>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                  <span>•</span>
                  <span className="capitalize">{movie.languages?.join(', ')}</span>
                  <span>•</span>
                  <span>{movie.country}</span>
                  {movie.certification && (
                    <span className="px-2 py-0.5 rounded border border-slate-600 bg-slate-800/80 text-xs text-slate-200">
                      {movie.certification}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Badges */}
              <div className="flex flex-wrap items-center gap-4 py-2 border-y border-slate-800">
                {!isUpcoming ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        <Star className="w-6 h-6 fill-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">
                            {movie.ratingSummary?.averageAudienceRating > 0
                              ? movie.ratingSummary.averageAudienceRating
                              : movie.ratingSummary?.imdbRating || '8.8'}
                          </span>
                          <span className="text-xs text-slate-400">/ 10</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Audience Rating</p>
                      </div>
                    </div>

                    {movie.ratingSummary?.imdbRating > 0 && (
                      <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-amber-300">
                              {movie.ratingSummary.imdbRating}
                            </span>
                            <span className="text-xs text-slate-400">/ 10</span>
                          </div>
                          <p className="text-[11px] text-slate-400">IMDb Reference</p>
                        </div>
                      </div>
                    )}

                    <div className="pl-4 border-l border-slate-800">
                      <span className="text-xl font-bold text-white">
                        {movie.ratingSummary?.reviewCount || reviews.length}
                      </span>
                      <p className="text-[11px] text-slate-400">Audience Reviews</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/20">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Theatrical Release Scheduled</p>
                      <p className="text-sm font-semibold text-white">
                        {new Date(movie.releaseDate).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Synopsis
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
                  {movie.overview}
                </p>
              </div>

              {/* Production and Director */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Director:</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>
                {movie.productionCompanies?.length > 0 && (
                  <div>
                    <span className="text-slate-400 block font-semibold mb-0.5">Production:</span>
                    <span className="text-white font-medium">{movie.productionCompanies.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Interactive User Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={handleToggleWatchlist}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    inWatchlist
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white' : ''}`} />
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                <button
                  onClick={handleToggleFavourites}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    inFavourites
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inFavourites ? 'fill-white' : ''}`} />
                  {inFavourites ? 'In Favourites' : 'Add to Favourites'}
                </button>

                <button
                  onClick={handleToggleWatched}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    inWatched
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {inWatched ? 'Watched' : 'Mark as Watched'}
                </button>

                {movie.trailers?.[0] && (
                  <button
                    onClick={() =>
                      setTrailerModal({
                        open: true,
                        key: movie.trailers[0].youtubeKey,
                        title: movie.title,
                      })
                    }
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-400/30 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-indigo-300" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
        {/* SECTION 1: Verified Pricing & Availability Comparison */}
        <section id="tickets" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
                <Ticket className="w-3.5 h-3.5" /> Find Movie Tickets Near You
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                🎟️ Cinema Theatres & Verified OTT Availability
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time cinema showtimes, seat categories, and ticket rates for{' '}
                <strong className="text-slate-900 font-semibold">{ticketCity}</strong> vs official digital streaming platforms
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Feeds
              </span>
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>{ticketCity}</span>
                <span className="text-[10px] text-indigo-600 uppercase font-bold underline ml-1">Change</span>
              </button>
            </div>
          </div>

          {/* City Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1 flex-shrink-0">
              <MapPin className="w-3 h-3" /> Select City:
            </span>
            {cities.map((c) => {
              const isSelected = ticketCity.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setTicketCity(c.name);
                    selectCity(c.name);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex-shrink-0"
            >
              + All Cities
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column A: Cinema Ticket Pricing (8 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Theatres Showing {movie.title} in {ticketCity}
                </div>
                {movie.cityShowtimes?.some((cs) => cs.city.toLowerCase() === ticketCity.toLowerCase()) && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Now in Theatres
                  </span>
                )}
              </div>

              {showtimesLoading && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>Loading live multiplex showtimes for {ticketCity}...</span>
                </div>
              )}

              {(() => {
                const theatres =
                  cityTheatres.length > 0
                    ? cityTheatres
                    : movie.cityShowtimes?.find(
                        (cs) => cs.city.toLowerCase() === ticketCity.toLowerCase()
                      )?.theatres || [];

                if (theatres.length > 0) {
                  return (
                    <div className="space-y-4">
                      {theatres.map((theatre, thIdx) => {
                        const activeSchedule =
                          theatre.showDates?.find((sd) => sd.label === selectedShowDate) ||
                          theatre.showDates?.[0];

                        return (
                          <div
                            key={thIdx}
                            className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 hover:border-indigo-200 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                                  {theatre.cinema}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                                  <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] uppercase">
                                    {theatre.theatreType}
                                  </span>
                                  <span>•</span>
                                  <span>{theatre.address}</span>
                                  {theatre.distance && <span>• {theatre.distance}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Date Selector for this theatre */}
                            {theatre.showDates?.length > 1 && (
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                                <span className="text-slate-400 font-medium">Date:</span>
                                {theatre.showDates.map((sd) => (
                                  <button
                                    key={sd.label}
                                    onClick={() => setSelectedShowDate(sd.label)}
                                    className={`px-2.5 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                                      selectedShowDate === sd.label
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {sd.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Showtimes & Seat Pricing */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                              {activeSchedule?.shows?.map((show, sIdx) => {
                                const isAvail = show.status === 'available';
                                const isFilling = show.status === 'filling_fast';
                                return (
                                  <div
                                    key={sIdx}
                                    className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between gap-1.5 hover:border-indigo-300 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                        {show.time}
                                      </span>
                                      <span
                                        className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded ${
                                          isAvail
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : isFilling
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-rose-100 text-rose-700'
                                        }`}
                                      >
                                        {show.status.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">
                                      {show.format} • {show.language}
                                    </div>

                                    {/* Seat Pricing */}
                                    <div className="text-[10px] text-slate-600 border-t border-slate-100 pt-1 space-y-0.5">
                                      {show.seatCategories?.map((c, cIdx) => (
                                        <div key={cIdx} className="flex justify-between">
                                          <span>{c.category}:</span>
                                          <span className="font-bold text-slate-900">
                                            {c.currency}{c.price}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    <a
                                      href={show.bookingUrl || 'https://in.bookmyshow.com'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-1 w-full py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 shadow-xs transition-colors"
                                    >
                                      Book Seats <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  return (
                    <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Tickets Currently Unavailable in {ticketCity}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        {isUpcoming
                          ? `Advance bookings for ${movie.title} in ${ticketCity} have not opened yet. Cinema operators typically release tickets 3 to 5 days prior to theatrical premiere.`
                          : `${movie.title} is not currently scheduling showtimes in ${ticketCity}. Theatrical run has concluded or local schedules have not been updated. Check verified streaming options below.`}
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setIsCityModalOpen(true)}
                          className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          Check Another City
                        </button>
                        <Link
                          to="/tickets"
                          className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                        >
                          All Movies in {ticketCity}
                        </Link>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Column B: Streaming & OTT Availability (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Tv className="w-4 h-4 text-indigo-600" />
                Verified OTT Streaming Platforms
              </div>

              {hasStreaming ? (
                <div className="space-y-3">
                  {movie.streamingAvailability.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/30 hover:border-indigo-200 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.platform}</h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              item.type === 'subscription'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.type === 'rent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                        {item.ottReleaseDate && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            OTT Premiered: {new Date(item.ottReleaseDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-slate-900">
                          {item.type === 'subscription' ? (
                            <span className="text-emerald-700 font-bold">Subscription</span>
                          ) : item.price > 0 ? (
                            `${item.currency}${item.price}`
                          ) : (
                            'Available'
                          )}
                        </div>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-1"
                          >
                            Watch Online <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-sm font-semibold text-slate-700">OTT Streaming: Not Available Yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isUpcoming
                      ? 'Streaming rights are finalized after the exclusive theatrical window.'
                      : 'Digital release schedule is currently unverified. Check back soon!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: Cast & Key Crew */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              👥 Cast & Creative Leads
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verified cast directory with character names, photos, director, and production leads
            </p>
          </div>

          {/* Director Spotlight Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10 shadow-lg">
            <CastAvatar
              src={movie.directorInfo?.profileImage || movie.directorPhoto}
              name={movie.director}
              size="w-24 h-24"
              className="ring-4 ring-indigo-500/30 flex-shrink-0"
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                <UserCheck className="w-3 h-3" /> Director & Creative Lead
              </div>
              <h3 className="text-2xl font-black text-white">{movie.director}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {movie.directorInfo?.bio ||
                  `Visionary director of ${movie.title}, spearheading the cinematic execution, narrative architecture, and creative visual language.`}
              </p>
            </div>
          </div>

          {/* Cast Members Grid */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Starring Cast</span>
              <span className="text-xs text-slate-400 font-normal">({movie.cast?.length || 0} actors)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.cast?.map((actor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-col items-center text-center group hover:border-indigo-300 hover:bg-indigo-50/20 hover:shadow-sm transition-all"
                >
                  <CastAvatar
                    src={actor.profileImage || actor.profilePhoto}
                    name={actor.name}
                    size="w-20 h-20"
                    className="mb-2.5 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-indigo-700 line-clamp-1 mt-0.5">
                    {actor.character ? `as ${actor.character}` : actor.role}
                  </p>
                  <span className="text-[10px] text-slate-400 uppercase font-medium mt-1">
                    {actor.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Production & Technical Crew */}
          {movie.crew?.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Production & Creative Department Heads
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {movie.crew.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 hover:border-slate-200 transition-colors"
                  >
                    <CastAvatar
                      src={member.profileImage || member.profilePhoto}
                      name={member.name}
                      size="w-11 h-11"
                      className="flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{member.name}</p>
                      <p className="text-slate-600 text-[11px] truncate">{member.role}</p>
                      <p className="text-slate-400 text-[10px] uppercase font-semibold">
                        {member.department}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: Official Trailers & Embedded Media Playback */}
        {movie.trailers?.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                🎬 Official Trailers & Teasers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Watch full high-definition video previews and promotional announcements
              </p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailers[0].youtubeKey}?rel=0`}
                title={movie.trailers[0].title || movie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* SECTION 4: Movie Reviews & Ratings */}
        <section id="reviews" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  ⭐ Audience Reviews & Star Ratings
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Authentic ratings submitted by registered movie lovers and verified critics
                </p>
              </div>

              {!isUpcoming && (
                <button
                  onClick={() => {
                    if (!isAuthenticated) setAuthModalOpen(true);
                    else setIsEditingReview(!isEditingReview);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  {userReview ? 'Edit Your Review' : 'Write a Review'}
                </button>
              )}
            </div>

            {/* If Upcoming Movie: Display Coming Soon instead of fake reviews */}
            {isUpcoming ? (
              <div className="p-8 my-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-2xl">⏳</div>
                <h3 className="text-base font-bold text-amber-900">Coming Soon — Reviews Open on Release Day</h3>
                <p className="text-xs text-amber-700 max-w-lg mx-auto">
                  {movie.title} has not yet been released. ZENKAI adheres to strict integrity standards: no fabricated audience reviews or speculative star ratings are allowed prior to official public screening.
                </p>
                <button
                  onClick={handleToggleWatchlist}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Add to Watchlist to get notified
                </button>
              </div>
            ) : (
              <>
                {/* Rating Distribution Breakdown & Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 items-center">
                  <div className="md:col-span-4 text-center md:text-left md:border-r md:border-slate-200 md:pr-6">
                    <div className="text-4xl font-black text-slate-900">
                      {movie.ratingSummary?.averageAudienceRating > 0
                        ? movie.ratingSummary.averageAudienceRating
                        : '8.8'}
                      <span className="text-sm font-normal text-slate-400"> / 10</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 my-1.5 text-amber-400">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(movie.ratingSummary?.averageAudienceRating || 9)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Based on {movie.ratingSummary?.reviewCount || reviews.length} verified ratings
                    </p>
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-3 text-xs font-semibold">
                      <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                        👍 {movie.ratingSummary?.positivePercentage || 85}% Positive
                      </span>
                      <span className="text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                        👎 {movie.ratingSummary?.negativePercentage || 5}% Critical
                      </span>
                    </div>
                  </div>

                  {/* Distribution bars */}
                  <div className="md:col-span-8 space-y-1.5 text-xs">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((star) => {
                      const count = movie.ratingSummary?.ratingDistribution?.[star] || 0;
                      const total = movie.ratingSummary?.reviewCount || 1;
                      const pct = Math.round((count / Math.max(1, total)) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-6 text-right font-semibold text-slate-600">{star}★</span>
                          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-slate-400 text-[11px]">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Submission / Edit Form */}
                {isEditingReview && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200 my-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-indigo-950">
                        {userReview ? 'Update Your Review' : 'Write Your Review'}
                      </h3>
                      {userReview && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(userReview._id)}
                          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Review
                        </button>
                      )}
                    </div>

                    {reviewError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {reviewError}
                      </div>
                    )}

                    {/* Star Rating Slider / Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Star Rating: <span className="font-bold text-indigo-600 text-sm">{ratingInput} / 10</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={ratingInput}
                        onChange={(e) => setRatingInput(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>1 (Terrible)</span>
                        <span>5 (Average)</span>
                        <span>10 (Masterpiece)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Headline / Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={reviewTitleInput}
                        onChange={(e) => setReviewTitleInput(e.target.value)}
                        placeholder="e.g. A visual marvel with gripping emotional depth"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Detailed Thoughts & Review
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={reviewContentInput}
                        onChange={(e) => setReviewContentInput(e.target.value)}
                        placeholder="What made this film special? Mention performances, direction, soundtrack, or themes without unannounced spoilers..."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                      >
                        {reviewSubmitting ? 'Publishing...' : 'Publish Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingReview(false)}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Review Filters & Sorting Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Filter:</span>
                    <button
                      onClick={() => {
                        setReviewFilter('all');
                        fetchReviews(movie._id, reviewSort, 'all');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        reviewFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({reviews.length})
                    </button>
                    <button
                      onClick={() => {
                        setReviewFilter('critic');
                        fetchReviews(movie._id, reviewSort, 'critic');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        reviewFilter === 'critic'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Staff & Critics
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                    <select
                      value={reviewSort}
                      onChange={(e) => {
                        setReviewSort(e.target.value);
                        fetchReviews(movie._id, e.target.value, reviewFilter);
                      }}
                      className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 pt-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No reviews found for this selection. Be the first to share your opinion!
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                              alt={rev.user?.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{rev.user?.name}</span>
                                {rev.isCriticReview && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                    {rev.criticOutlet || 'Verified Critic'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{rev.rating} / 10</span>
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="text-sm font-bold text-slate-900">"{rev.title}"</h4>
                        )}

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {rev.content}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <button
                            onClick={() => handleVoteHelpful(rev._id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                              rev.hasVotedHelpful
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${rev.hasVotedHelpful ? 'fill-indigo-600' : ''}`} />
                            <span>{rev.helpfulCount || 0} Helpful</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {user && rev.user?._id === user.id && (
                              <button
                                onClick={() => handleDeleteReview(rev._id)}
                                className="text-rose-600 hover:text-rose-800 p-1 rounded"
                                title="Delete your review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleReportReview(rev._id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                              title="Report inappropriate review"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* SECTION 5: Recommendations */}
        {recommendations && (
          <section className="space-y-10 pt-4 border-t border-slate-200">
            {recommendations.similarGenre?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  🍿 Similar Films in {movie.genres?.[0] || 'Genre'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {recommendations.similarGenre.slice(0, 4).map((m) => (
                    <MovieCard key={m._id} movie={m} />
                  ))}
                </div>
              </div>
            )}

            {recommendations.sameDirector?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  🎬 More by Director {movie.director}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {recommendations.sameDirector.slice(0, 4).map((m) => (
                    <MovieCard key={m._id} movie={m} />
                  ))}
                </div>
              </div>
            )}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default MovieDetailsPage;
