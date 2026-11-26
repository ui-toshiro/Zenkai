import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ExternalLink, Music, Sparkles } from 'lucide-react';

const MusicEventCard = ({ event }) => {
  if (!event) return null;

  const lowestPrice =
    event.ticketPricing && event.ticketPricing.length > 0
      ? Math.min(...event.ticketPricing.map((t) => t.price))
      : null;

  const currency = event.ticketPricing?.[0]?.currency || '₹';
  const bookingUrl = event.ticketPricing?.[0]?.bookingUrl || 'https://in.bookmyshow.com';

  const dateObj = new Date(event.eventDate);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Event Banner / Poster */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-slate-100">
        <Link to={`/music/${event.slug || event._id}`} className="block w-full h-full">
          <img
            src={event.poster || event.banner}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>

        {/* Event Type Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm flex items-center gap-1">
            <Music className="w-2.5 h-2.5" />
            {event.eventType === 'festival' ? 'Festival' : event.eventType === 'tour' ? 'Tour' : 'Concert'}
          </span>
          {event.isInternational && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-900/90 text-indigo-100 backdrop-blur-xs">
              Global Tour
            </span>
          )}
          {event.status === 'rescheduled' && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm">
              Rescheduled
            </span>
          )}
          {event.status === 'postponed' && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-sm">
              Postponed
            </span>
          )}
          {event.status === 'sold_out' && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white shadow-sm">
              Sold Out
            </span>
          )}
          {event.status === 'filling_fast' && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
              Filling Fast
            </span>
          )}
        </div>

        {/* Date Overlay Pill */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Details Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.venue?.name}, {event.venue?.city}</span>
          </div>

          <Link
            to={`/music/${event.slug || event._id}`}
            className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 block"
            title={event.title}
          >
            {event.title}
          </Link>

          {/* Performing Artist Link */}
          <p className="text-xs font-semibold text-indigo-600 line-clamp-1 mt-0.5">
            By {event.artistName}
          </p>

          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
            {event.genres?.join(', ') || 'Live Music'}
          </p>
        </div>

        {/* Bottom Pricing & Booking Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tickets From</span>
            <div className="text-sm sm:text-base font-black text-slate-900 flex items-baseline gap-0.5">
              <span>{currency}</span>
              <span>{lowestPrice ? lowestPrice.toLocaleString() : 'Free'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/music/${event.slug || event._id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Details
            </Link>

            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Book</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicEventCard;
