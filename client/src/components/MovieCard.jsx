import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Ticket, Play, MapPin, Sparkles, Flame } from 'lucide-react';
import MoviePoster from './MoviePoster';

const MovieCard = ({ movie, selectedCity }) => {
  const isNowShowing = movie.releaseStatus === 'now_showing';
  const isUpcoming = movie.releaseStatus === 'upcoming';

  const now = new Date();
  const releaseDateObj = movie.releaseDate ? new Date(movie.releaseDate) : null;
  const isWithin30Days =
    isUpcoming &&
    releaseDateObj &&
    releaseDateObj.getTime() >= now.getTime() &&
    releaseDateObj.getTime() <= now.getTime() + 30 * 24 * 60 * 60 * 1000;
  const is2027 =
    isUpcoming &&
    (movie.releaseYear === 2027 || (releaseDateObj && releaseDateObj.getFullYear() === 2027));

  // Determine city-specific availability
  const isShowingInCity = movie.isShowingInCity !== undefined ? movie.isShowingInCity : true;
  const hasTickets = isNowShowing && isShowingInCity;

  // Rating display: audience or imdb
  const rating =
    movie.ratingSummary?.averageAudienceRating > 0
      ? movie.ratingSummary.averageAudienceRating
      : movie.ratingSummary?.imdbRating || null;

  // Formatted release date
  const formattedReleaseDate = releaseDateObj
    ? releaseDateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : `${movie.releaseYear || 2026}`;

  // Days countdown for releasing soon
  const daysLeft = releaseDateObj
    ? Math.max(1, Math.ceil((releaseDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Poster Container */}
      <Link to={`/movie/${movie.slug || movie._id}`} className="relative aspect-[2/3] overflow-hidden bg-slate-100 block">
        <MoviePoster
          src={movie.poster}
          alt={movie.title}
          aspectRatio="aspect-[2/3]"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-white text-xs font-semibold flex items-center gap-1">
            <Play className="w-3.5 h-3.5 fill-white" /> View Details & Trailer
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {isNowShowing && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Now Showing
            </span>
          )}
          {isWithin30Days && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-600 text-white shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Releasing Soon
            </span>
          )}
          {is2027 && !isWithin30Days && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-indigo-600 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-200" />
              Coming in 2027
            </span>
          )}
          {isUpcoming && !isWithin30Days && !is2027 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500 text-slate-950 shadow-sm">
              Upcoming
            </span>
          )}
        </div>

        {/* Rating Badge */}
        {rating && !isUpcoming && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-slate-900/85 backdrop-blur-md text-amber-400 px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
            <span>{movie.releaseYear || (releaseDateObj ? releaseDateObj.getFullYear() : '2026')}</span>
            <span>•</span>
            <span className="capitalize">{movie.languages?.[0] || 'English'}</span>
            {movie.certification && (
              <>
                <span>•</span>
                <span className="border border-slate-200 px-1 rounded text-[10px] text-slate-600">
                  {movie.certification}
                </span>
              </>
            )}
          </div>

          <Link
            to={`/movie/${movie.slug || movie._id}`}
            className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 block"
            title={movie.title}
          >
            {movie.title}
          </Link>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {movie.genres?.join(', ') || 'Theatrical Premiere'}
          </p>
        </div>

        {/* Bottom Details / Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          {hasTickets ? (
            <Link
              to={`/movie/${movie.slug || movie._id}#tickets`}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <Ticket className="w-3 h-3" />
              {movie.startingPrice ? `From ₹${movie.startingPrice} • Tickets` : 'Book Tickets'}
            </Link>
          ) : isNowShowing && !isShowingInCity ? (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              No shows in {selectedCity || 'city'}
            </span>
          ) : isWithin30Days ? (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysLeft ? `In ${daysLeft} days • ${formattedReleaseDate}` : formattedReleaseDate}
            </span>
          ) : isUpcoming ? (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedReleaseDate}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[130px]">
              Cinema Release
            </span>
          )}

          <Link
            to={`/movie/${movie.slug || movie._id}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
