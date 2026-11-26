import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Music, Shield, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Intro */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍿</span>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                ZENKAI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              The premier Movies & Music Events Discovery Platform. Explore currently running movies, upcoming releases, stadium concerts, and music festivals with verified ticket pricing.
            </p>
          </div>

          {/* Movies Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-indigo-600" /> Movies & Cinema
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link to="/search?type=movies&status=now_showing" className="hover:text-indigo-600">
                  Now Showing in Theatres
                </Link>
              </li>
              <li>
                <Link to="/search?type=movies&status=upcoming" className="hover:text-indigo-600">
                  Upcoming Theatrical Releases
                </Link>
              </li>
              <li>
                <Link to="/search?type=movies&genre=Action" className="hover:text-indigo-600">
                  Action & Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/search?type=movies&industry=bollywood" className="hover:text-indigo-600">
                  Bollywood Cinema
                </Link>
              </li>
              <li>
                <Link to="/search?type=movies&industry=hollywood" className="hover:text-indigo-600">
                  Hollywood Hits
                </Link>
              </li>
            </ul>
          </div>

          {/* Music Events Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-600" /> Music & Concerts
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link to="/music?eventType=concert" className="hover:text-rose-600">
                  Upcoming Arena Concerts
                </Link>
              </li>
              <li>
                <Link to="/music?eventType=festival" className="hover:text-rose-600">
                  Music Festivals & Weekenders
                </Link>
              </li>
              <li>
                <Link to="/music?eventType=tour" className="hover:text-rose-600">
                  Global Artist Tours
                </Link>
              </li>
              <li>
                <Link to="/artists" className="hover:text-rose-600">
                  Musicians & Bands Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Feedback */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Community & Feedback
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We welcome suggestions, feature ideas, and bug reports from visitors and developers.
            </p>
            <div className="space-y-2 pt-1">
              <Link
                to="/feedback"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
              >
                💡 Submit Feedback & Ideas
              </Link>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Verified Event Schedules & Booking
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ZENKAI Entertainment. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/feedback" className="hover:text-indigo-600 transition-colors">
              Suggestions & Improvements
            </Link>
            <span>•</span>
            <Link to="/tickets" className="hover:text-indigo-600 transition-colors">
              Cinema Showtimes
            </Link>
            <span>•</span>
            <span className="text-slate-400">Public Online Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
