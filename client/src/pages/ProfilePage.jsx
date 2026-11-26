import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Heart,
  CheckCircle,
  MessageSquare,
  Clock,
  User,
  Star,
  Trash2,
  Music,
  Bell,
  Mic2,
  Film,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import MusicEventCard from '../components/MusicEventCard';
import ArtistCard from '../components/ArtistCard';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile-data');
      if (res.data.success) {
        setProfileData(res.data);
      }
    } catch (err) {
      console.error('[Profile Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        fetchProfileData();
      }
    } catch (err) {
      alert('Error deleting review');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
        <div className="p-3 bg-indigo-50 rounded-2xl inline-block text-2xl mb-3">🍿</div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Please Sign In</h2>
        <p className="text-xs text-slate-500 mb-4">
          Sign in to access your Movie Watchlist, Saved Music Events, Concert Reminders, and Favourite Artists.
        </p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading your profile & saved collections...</p>
      </div>
    );
  }

  const { stats, reviews, user: userData } = profileData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={userData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
          alt={userData?.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{userData?.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {userData?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{userData?.email}</p>
          {userData?.bio && (
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl">{userData.bio}</p>
          )}

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 sm:gap-6 mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <div>
              <span className="text-slate-900 font-black text-base block">{stats?.watchlistCount || 0}</span>
              <span>Movie Watchlist</span>
            </div>
            <div>
              <span className="text-rose-600 font-black text-base block">{stats?.savedEventsCount || 0}</span>
              <span>Saved Concerts</span>
            </div>
            <div>
              <span className="text-amber-600 font-black text-base block">{stats?.remindersCount || 0}</span>
              <span>Reminders</span>
            </div>
            <div>
              <span className="text-purple-600 font-black text-base block">{stats?.favouriteArtistsCount || 0}</span>
              <span>Fav Artists</span>
            </div>
            <div>
              <span className="text-indigo-600 font-black text-base block">{stats?.reviewsCount || 0}</span>
              <span>Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'watchlist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Movie Watchlist ({userData?.watchlist?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('saved_events')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'saved_events' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Music className="w-4 h-4" />
          Saved Music Events ({userData?.savedEvents?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'reminders' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Concert Reminders ({userData?.eventReminders?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('favourite_artists')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'favourite_artists' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mic2 className="w-4 h-4" />
          Favourite Artists ({userData?.favouriteArtists?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('favourites')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'favourites' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          Favourite Movies ({userData?.favourites?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          My Reviews ({reviews?.length || 0})
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. Watchlist */}
      {activeTab === 'watchlist' && (
        <div>
          {userData?.watchlist?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p className="text-3xl mb-2">🔖</p>
              <h3 className="text-sm font-bold text-slate-800">Your Watchlist is empty</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore movies and click "Add to Watchlist" to save titles.
              </p>
              <Link to="/search?type=movies" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
                Explore Movies
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {userData?.watchlist?.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Saved Music Events */}
      {activeTab === 'saved_events' && (
        <div>
          {userData?.savedEvents?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p className="text-3xl mb-2">🎸</p>
              <h3 className="text-sm font-bold text-slate-800">No saved music events</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Find concerts and festivals you are interested in attending and save them here.
              </p>
              <Link to="/music" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
                Explore Live Music
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData?.savedEvents?.map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Event Reminders */}
      {activeTab === 'reminders' && (
        <div>
          {userData?.eventReminders?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No active concert reminders</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click "Set Concert Reminder" on any event page to receive timely notifications prior to show day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData?.eventReminders?.map((rem, idx) => (
                rem.event && <MusicEventCard key={idx} event={rem.event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Favourite Artists */}
      {activeTab === 'favourite_artists' && (
        <div>
          {userData?.favouriteArtists?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Mic2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No favourite musicians added yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Follow your top musicians to stay informed of their tour announcements.
              </p>
              <Link to="/artists" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold">
                Explore Artists
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {userData?.favouriteArtists?.map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Favourite Movies */}
      {activeTab === 'favourites' && (
        <div>
          {userData?.favourites?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No favorite movies marked</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {userData?.favourites?.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews?.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">You haven't written any reviews yet</h3>
            </div>
          ) : (
            reviews?.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/movie/${r.movie?.slug || r.movie?._id}`}
                      className="font-bold text-sm text-indigo-600 hover:underline"
                    >
                      {r.movie?.title}
                    </Link>
                    <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {r.rating} / 10
                    </span>
                  </div>

                  {r.title && <h4 className="text-sm font-bold text-slate-900">"{r.title}"</h4>}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{r.content}</p>
                </div>

                <div className="self-end sm:self-center">
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
