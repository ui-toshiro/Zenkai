import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Ticket,
  MapPin,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
  Sparkles,
  Building2,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useCity } from '../context/CityContext';
import MoviePoster from '../components/MoviePoster';

const CityTicketFinderPage = () => {
  const {
    selectedCity,
    selectedState,
    selectedCityData,
    selectCity,
    cities,
    totalSearchableCities,
    setIsCityModalOpen,
  } = useCity();
  const [searchParams, setSearchParams] = useSearchParams();

  const [movieQuery, setMovieQuery] = useState(searchParams.get('q') || '');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMovieId, setActiveMovieId] = useState(null);

  useEffect(() => {
    fetchCityMovies();
  }, [selectedCity, selectedState, movieQuery]);

  const fetchCityMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(
        `/movies/tickets/search?city=${encodeURIComponent(selectedCity)}&state=${encodeURIComponent(
          selectedState || ''
        )}&q=${encodeURIComponent(movieQuery)}`
      );
      if (res.data.success) {
        setMovies(res.data.movies || []);
        if (res.data.movies?.length > 0 && !activeMovieId) {
          setActiveMovieId(res.data.movies[0]._id);
        }
      }
    } catch (err) {
      console.error('[Ticket Search Error]', err);
      setError('Failed to retrieve cinema schedules for the selected city.');
    } finally {
      setLoading(false);
    }
  };

  const currentCityInfo = selectedCityData || cities.find(
    (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
  ) || { name: selectedCity, state: selectedState || 'India', cinemasCount: 15 };

  const showingMovies = movies.filter((m) => m.isShowingInCity);
  const notShowingMovies = movies.filter((m) => !m.isShowingInCity);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 text-white pt-10 pb-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-3">
                <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                Find Movie Tickets Near You
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Cinema Theatres & Showtimes in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                  {selectedCity}
                </span>
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl">
                Browse real-time cinema schedules, compare ticket prices across seat categories, and book tickets directly through official booking partners.
              </p>
            </div>

            {/* City Switcher Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col gap-2 min-w-[280px]">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Current Selected City
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCity}</h3>
                  <p className="text-xs text-slate-400">
                    {currentCityInfo.state} • {currentCityInfo.cinemasCount || 30}+ Cinemas
                  </p>
                </div>
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Change City
                </button>
              </div>
            </div>
          </div>

          {/* City Pills Carousel */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold flex-shrink-0 mr-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Quick City Switch:
            </span>
            {cities.map((city) => {
              const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={`${city.name}-${city.state || ''}`}
                  onClick={() => selectCity(city, city.state)}
                  className={`px-3 py-1.5 rounded-full flex-shrink-0 font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full flex-shrink-0 font-bold bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-400/30 transition-all flex items-center gap-1.5"
            >
              <span>+ Search All Indian Cities ({totalSearchableCities.toLocaleString()}+)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/80 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search movie titles showing in ${selectedCity} (e.g. Dune, Jawan, 12th Fail)...`}
              value={movieQuery}
              onChange={(e) => setMovieQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm"
            />
          </div>

          {/* Format Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            {['All', 'IMAX 2D', '4DX', 'Dolby Atmos', 'Gold Class'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-2 rounded-xl font-semibold transition-colors flex-shrink-0 ${
                  selectedFormat === fmt
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="mt-8">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">
                Finding available cinema showtimes in {selectedCity}...
              </p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-rose-800">{error}</p>
            </div>
          ) : showingMovies.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-sm">
              <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No Theatrical Showtimes Found
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                No movies matching "{movieQuery}" are currently running in {selectedCity}. Try searching another title or change your city.
              </p>
              <button
                onClick={() => setMovieQuery('')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {showingMovies.map((movie) => {
                // Filter theatres by format if needed
                const filteredTheatres = movie.theatres.filter((th) => {
                  if (selectedFormat === 'All') return true;
                  return (
                    th.theatreType?.toLowerCase().includes(selectedFormat.toLowerCase()) ||
                    th.showDates?.some((sd) =>
                      sd.shows?.some((s) =>
                        s.format?.toLowerCase().includes(selectedFormat.toLowerCase())
                      )
                    )
                  );
                });

                if (filteredTheatres.length === 0 && selectedFormat !== 'All') return null;

                return (
                  <div
                    key={movie._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                  >
                    {/* Movie Summary Bar */}
                    <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-white/10">
                          <MoviePoster src={movie.poster} alt={movie.title} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500 text-white">
                              Now Showing
                            </span>
                            <span className="text-xs text-slate-300">
                              {movie.releaseYear} • {movie.runtime} min • {movie.languages?.join(', ')}
                            </span>
                          </div>
                          <Link
                            to={`/movie/${movie.slug || movie._id}`}
                            className="text-lg font-black hover:text-indigo-300 transition-colors"
                          >
                            {movie.title}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {movie.genres?.join(', ')} • Directed by {movie.director}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center">
                        <Link
                          to={`/movie/${movie.slug || movie._id}`}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          View Film Page →
                        </Link>
                      </div>
                    </div>

                    {/* Theatres & Showtimes List */}
                    <div className="p-5 sm:p-6 divide-y divide-slate-100">
                      {filteredTheatres.map((theatre, thIdx) => {
                        const todaySchedule =
                          theatre.showDates?.find((sd) => sd.label === selectedDate) ||
                          theatre.showDates?.[0];

                        return (
                          <div
                            key={thIdx}
                            className={`py-5 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-start justify-between gap-6`}
                          >
                            {/* Cinema Info */}
                            <div className="lg:max-w-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {theatre.cinema}
                                </h4>
                              </div>
                              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {theatre.theatreType}
                              </span>
                              <p className="text-xs text-slate-500">{theatre.address}</p>
                              {theatre.distance && (
                                <p className="text-[11px] text-slate-400 font-medium">
                                  📍 {theatre.distance}
                                </p>
                              )}
                              {theatre.cancellationAvailable && (
                                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                  <ShieldCheck className="w-3 h-3" /> Cancellation Available
                                </p>
                              )}
                            </div>

                            {/* Showtimes Pills */}
                            <div className="flex-1 space-y-3">
                              {/* Date Selector for this theatre */}
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-400 font-medium flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> Date:
                                </span>
                                {theatre.showDates?.map((sd) => (
                                  <button
                                    key={sd.label}
                                    onClick={() => setSelectedDate(sd.label)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                      selectedDate === sd.label
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {sd.label} ({sd.date.slice(5)})
                                  </button>
                                ))}
                              </div>

                              {/* Shows Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {todaySchedule?.shows?.map((show, sIdx) => {
                                  const isAvailable = show.status === 'available';
                                  const isFillingFast = show.status === 'filling_fast';
                                  const isAlmostFull = show.status === 'almost_full';

                                  return (
                                    <div
                                      key={sIdx}
                                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col justify-between group/show relative"
                                    >
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-extrabold text-slate-900 text-sm">
                                            {show.time}
                                          </span>
                                          <span
                                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                              isAvailable
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : isFillingFast
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-rose-100 text-rose-700'
                                            }`}
                                          >
                                            {show.status.replace('_', ' ')}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium">
                                          {show.format} • {show.language}
                                        </p>
                                      </div>

                                      {/* Seat pricing breakdown */}
                                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] space-y-0.5">
                                        {show.seatCategories?.map((cat, cIdx) => (
                                          <div
                                            key={cIdx}
                                            className="flex items-center justify-between text-slate-600"
                                          >
                                            <span>{cat.category}:</span>
                                            <span className="font-bold text-slate-900">
                                              {cat.currency}{cat.price}
                                            </span>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Booking Link */}
                                      <a
                                        href={show.bookingUrl || 'https://in.bookmyshow.com'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg text-center flex items-center justify-center gap-1 shadow-xs transition-colors"
                                      >
                                        Book Seats <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Transparent Notice for Upcoming or Titles not showing in City */}
          {notShowingMovies.length > 0 && (
            <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Theatrical Status for Other Titles in {selectedCity}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                The following movies are currently not scheduling shows in {selectedCity}. Tickets are either not yet open for advance booking or theatrical runs have concluded.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {notShowingMovies.map((m) => (
                  <div
                    key={m._id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3"
                  >
                    <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0">
                      <MoviePoster src={m.poster} alt={m.title} />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/movie/${m.slug || m._id}`}
                        className="font-bold text-xs text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {m.title}
                      </Link>
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                        {m.releaseStatus === 'upcoming'
                          ? 'Advance bookings open soon'
                          : 'Theatrical run concluded'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityTicketFinderPage;
