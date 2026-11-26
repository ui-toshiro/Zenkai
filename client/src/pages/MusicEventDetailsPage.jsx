import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Bookmark,
  Bell,
  Share2,
  ExternalLink,
  ShieldCheck,
  Play,
  Sparkles,
  Users,
  Mic2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MusicEventCard from '../components/MusicEventCard';
import AuthModal from '../components/AuthModal';

const MusicEventDetailsPage = () => {
  const { idOrSlug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
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
    fetchEventDetails();
  }, [idOrSlug]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/music/events/${idOrSlug}`);
      if (res.data.success) {
        setEvent(res.data.event);
        setIsSaved(res.data.userContext?.isSaved || false);
        setHasReminder(res.data.userContext?.hasReminder || false);
        setRelatedEvents(res.data.relatedEvents || []);

        if (isAuthenticated) {
          api.post('/users/recently-viewed', {
            itemType: 'music_event',
            itemId: res.data.event._id,
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('[Event Details Error]', err);
      setError('Music event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/saved-events/${event._id}`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error updating saved events');
    }
  };

  const handleToggleReminder = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/users/event-reminders/${event._id}`);
      if (res.data.success) {
        setHasReminder(res.data.hasReminder);
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Error setting reminder');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading concert details & ticketing...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-xs">
        <p className="text-3xl mb-2">🎸</p>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Event Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Unable to retrieve event information.'}</p>
        <Link to="/music" className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold">
          Return to Music Events Hub
        </Link>
      </div>
    );
  }

  const dateObj = new Date(event.eventDate);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pb-20">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-rose-400" />
          {toastMessage}
        </div>
      )}

      {/* Hero Banner Container */}
      <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={event.banner || event.poster}
            alt={event.title}
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
            <Link to="/music" className="hover:text-white transition-colors">Music Events</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium truncate max-w-xs">{event.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Poster Card */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-[4/3] sm:aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 relative">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                  {event.eventType}
                </span>
              </div>
            </div>

            {/* Event Header Metadata */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-400/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  Verified Event & Tour Stop
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {event.title}
                </h1>
                <p className="text-sm sm:text-base text-rose-300 font-semibold mt-1">
                  Headline: {event.artistName}
                </p>
              </div>

              {/* Date & Venue Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Date & Time</span>
                    <span className="font-bold text-white">{formattedDate} • {event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Venue & Location</span>
                    <span className="font-bold text-white">{event.venue?.name}, {event.venue?.city}</span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {event.genres?.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Interactive Actions: Save & Set Reminder */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={handleToggleSave}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isSaved
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  {isSaved ? 'Event Saved' : 'Save Event'}
                </button>

                <button
                  onClick={handleToggleReminder}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    hasReminder
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${hasReminder ? 'fill-white' : ''}`} />
                  {hasReminder ? 'Reminder Set' : 'Set Concert Reminder'}
                </button>

                {event.ticketPricing?.[0]?.bookingUrl && (
                  <a
                    href={event.ticketPricing[0].bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30"
                  >
                    <span>Book Official Tickets</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Ticket Categories & Pricing Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                🎟️ Ticket Categories & Official Booking
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified tier pricing and direct platform links for official ticket reservation
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Ticketing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {event.ticketPricing?.map((ticket, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-rose-300 hover:bg-rose-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                    Tier {idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{ticket.category}</h4>
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    {ticket.currency}{ticket.price.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">
                    {ticket.isAvailable ? 'Instant Confirmation' : 'Sold Out'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <a
                    href={ticket.bookingUrl || 'https://in.bookmyshow.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve Seat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performing Artists Lineup */}
        {event.performingArtists?.length > 0 && (
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              🎤 Performing Artists Lineup
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Featured musicians, headliners, and supporting stage acts
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {event.performingArtists.map((artist, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group"
                >
                  <img
                    src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover mb-2 ring-2 ring-slate-200 group-hover:ring-rose-400 transition-all"
                  />
                  <h4 className="text-sm font-bold text-slate-900">{artist.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{artist.role}</p>

                  {artist.artistRef && (
                    <Link
                      to={`/artist/${artist.artistRef.slug || artist.artistRef._id || artist.artistRef}`}
                      className="text-xs font-semibold text-rose-600 hover:underline mt-2 inline-flex items-center gap-0.5"
                    >
                      View Profile →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Event Description & Venue Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About the Event</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.promotionalVideo && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-rose-600" /> Promotional Video & Concert Preview
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${event.promotionalVideo}?rel=0`}
                    title={event.title}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Venue & Location Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 self-start">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" /> Venue & Directions
            </h3>

            <div className="text-xs space-y-2 text-slate-600">
              <p className="font-bold text-slate-900 text-sm">{event.venue?.name}</p>
              <p>{event.venue?.address || 'City Center Complex'}</p>
              <p>{event.venue?.city}, {event.venue?.state} ({event.venue?.country})</p>
            </div>

            {event.venue?.mapUrl && (
              <a
                href={event.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Related Concerts */}
        {relatedEvents.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              More Live Concerts & Tours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((e) => (
                <MusicEventCard key={e._id} event={e} />
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

export default MusicEventDetailsPage;
