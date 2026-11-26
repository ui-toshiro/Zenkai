import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mic2,
  Radio,
  Heart,
  Globe,
  Calendar,
  ExternalLink,
  Play,
  Sparkles,
  Music,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MusicEventCard from '../components/MusicEventCard';
import ArtistAvatar from '../components/ArtistAvatar';
import AuthModal from '../components/AuthModal';

const ArtistProfilePage = () => {
  const { idOrSlug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [artist, setArtist] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArtist();
  }, [idOrSlug]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/artists/${idOrSlug}`);
      if (res.data.success) {
        setArtist(res.data.artist);
        setUpcomingEvents(res.data.upcomingEvents || []);
        setRelatedArtists(res.data.relatedArtists || []);
        setIsFavourite(res.data.isFavourite || false);
      }
    } catch (err) {
      console.error('[Artist Profile Error]', err);
      setError('Artist not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/favourite-artists/${artist._id}`);
      if (res.data.success) {
        setIsFavourite(res.data.isFavourite);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error updating favourite artist');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading artist profile & tour dates...</p>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-xs">
        <p className="text-3xl mb-2">🎤</p>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Artist Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Unable to retrieve artist information.'}</p>
        <Link to="/artists" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold">
          Return to Artists Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={artist.banner || artist.image}
            alt={artist.name}
            className="w-full h-full object-cover object-center opacity-35 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/artists" className="hover:text-white transition-colors">Artists</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium truncate max-w-xs">{artist.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-2xl bg-slate-900 flex-shrink-0">
              <ArtistAvatar
                src={artist.image}
                name={artist.name}
                className="w-full h-full"
                isLarge={true}
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/20">
                <Mic2 className="w-3.5 h-3.5" />
                Featured Musician
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {artist.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-purple-400 font-bold bg-purple-400/10 px-2.5 py-0.5 rounded-full border border-purple-400/20">
                  <Radio className="w-3.5 h-3.5" />
                  {artist.monthlyListeners || '15M+'} Monthly Listeners
                </span>
                <span>•</span>
                <span>{artist.country}</span>
                <span>•</span>
                <span>{artist.genres?.join(', ')}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
                <button
                  onClick={handleToggleFavourite}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isFavourite
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavourite ? 'fill-white' : ''}`} />
                  {isFavourite ? 'Favourite Artist' : 'Add to Favourites'}
                </button>

                {artist.socialLinks?.spotify && (
                  <a
                    href={artist.socialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <span>Spotify Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Biography */}
        {artist.bio && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Biography</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
              {artist.bio}
            </p>
          </section>
        )}

        {/* Popular Tracks Table */}
        {artist.popularTracks?.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" /> Top Songs & Fan Favourites
            </h2>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {artist.popularTracks.map((track, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-slate-400">{idx + 1}</span>
                    <div>
                      <p className="font-bold text-slate-900">{track.title}</p>
                      <p className="text-[11px] text-slate-400">{track.album || 'Single'}</p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">{track.duration}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Albums & Discography */}
        {artist.albums?.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" /> Studio Albums & Discography
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {artist.albums.map((album, idx) => (
                <div key={idx} className="group flex flex-col gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs">
                    <img
                      src={album.cover || artist.image}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = artist.image;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">{album.title}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{album.year} • {album.totalTracks || 10} Tracks</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest Release Banner */}
        {artist.latestRelease?.title && (
          <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/20">
                Latest Release • {artist.latestRelease.type || 'Single'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black">{artist.latestRelease.title}</h3>
              <p className="text-xs text-slate-300">Released in {artist.latestRelease.releaseDate || '2026'}</p>
            </div>
            {artist.latestRelease.url && (
              <a
                href={artist.latestRelease.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 flex-shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                Listen on Streaming
              </a>
            )}
          </section>
        )}

        {/* Featured Music Video */}
        {artist.featuredVideo && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-600 fill-rose-600" /> Official Music Video & Performance
            </h2>
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${artist.featuredVideo}?rel=0&modestbranding=1`}
                title={`${artist.name} Official Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>
        )}

        {/* Upcoming Concerts & Tour Dates */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                🎫 Upcoming Concerts & Tour Dates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Catch {artist.name} live in action across stadiums, arenas, and festival stages
              </p>
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No scheduled tour stops right now</h3>
              <p className="text-xs text-slate-400 mt-1">
                New dates are announced frequently. Add {artist.name} to your favorites to get notified!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <MusicEventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Related Artists Discovery */}
        {relatedArtists?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  👥 Fans Also Like & Related Musicians
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Discover more artists exploring similar sounds, genres, and concert circuits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedArtists.map((rel, idx) => (
                <Link
                  key={rel._id || idx}
                  to={`/artist/${rel.slug || rel._id}`}
                  className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 ring-4 ring-slate-100 group-hover:ring-purple-200 transition-all shadow-md">
                    <ArtistAvatar
                      src={rel.image}
                      name={rel.name}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {rel.genres?.slice(0, 2).join(' • ') || 'Musician'}
                  </p>
                  <span className="mt-2 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {rel.monthlyListeners || '10M+ listeners'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default ArtistProfilePage;
