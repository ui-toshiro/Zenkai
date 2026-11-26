import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Send,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  Bug,
  Layout,
  Zap,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import api from '../services/api';

const CATEGORIES = [
  {
    id: 'UI/UX Improvements',
    label: 'UI/UX Improvements',
    icon: Layout,
    desc: 'Suggestions on layout, typography, cards, visual appeal, or mobile ergonomics',
  },
  {
    id: 'New Features',
    label: 'New Features',
    icon: Lightbulb,
    desc: 'Ideas for new filters, notifications, integrations, or discovery features',
  },
  {
    id: 'Bug Reports',
    label: 'Bug Reports',
    icon: Bug,
    desc: 'Found an error, broken link, layout misalignment, or incorrect information?',
  },
  {
    id: 'Performance',
    label: 'Performance & Speed',
    icon: Zap,
    desc: 'Feedback on loading speed, page lag, image caching, or responsiveness',
  },
  {
    id: 'General Suggestions',
    label: 'General Suggestions',
    icon: MessageSquare,
    desc: 'Any other thoughts, comments, or words of encouragement',
  },
];

const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('UI/UX Improvements');
  const [suggestion, setSuggestion] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion || suggestion.trim().length < 5) {
      setError('Please provide at least 5 characters describing your suggestion.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const res = await api.post('/feedback', {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        category,
        suggestion: suggestion.trim(),
        rating,
      });

      if (res.data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSuggestion('');
        setRating(5);
      }
    } catch (err) {
      console.error('[Feedback Submission Error]', err);
      setError(
        err.response?.data?.message || 'Failed to submit feedback. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white pt-12 pb-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/20">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Community Feedback & Improvement Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Website Feedback &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400">
                Suggestions
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Help us shape the future of ZENKAI! Whether you noticed a bug, have an idea for a feature, or want to suggest UI improvements, your voice directly guides our ongoing development.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feedback Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            {success ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Thank You for Your Feedback!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Your suggestion has been securely recorded in our database. Our product and engineering team reviews every submission to continuously improve ZENKAI.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Another Suggestion
                  </button>
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Share Your Thoughts & Ideas
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No account required. Fill in the details below to submit your suggestion.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    1. Select Feedback Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                              : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl flex-shrink-0 ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{cat.label}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{cat.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestion Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Describe Your Suggestion or Feedback <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {suggestion.length} / 3000 chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Tell us what you like, what is confusing, any bugs you observed, or features you would love to see..."
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm leading-relaxed"
                    required
                  />
                </div>

                {/* Platform Experience Rating */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    3. How is your overall experience with ZENKAI?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {rating === 5
                        ? '🌟 Excellent'
                        : rating === 4
                        ? '👍 Great'
                        : rating === 3
                        ? '👌 Good'
                        : rating === 2
                        ? '⚠️ Needs Work'
                        : '🛑 Disappointing'}
                    </span>
                  </div>
                </div>

                {/* Optional Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Your Feedback...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Feedback & Suggestions
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    🔒 Submissions are protected against spam and reviewed directly by the development team.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Why Your Feedback Matters & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Community-Driven Development
              </div>
              <h3 className="text-xl font-black text-white">Why Your Feedback Matters</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                ZENKAI was engineered to solve common pain points in discovering movie showtimes, upcoming franchise release calendars, and stadium music tours.
              </p>

              <div className="mt-5 space-y-3.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-indigo-500/30 text-indigo-300 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Admin-Reviewed:</strong> All submissions are organized and triaged in our administrative console.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-indigo-500/30 text-indigo-300 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Continuous Improvements:</strong> Feature requests with popular demand are fast-tracked into upcoming releases.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-indigo-500/30 text-indigo-300 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white">Data Accuracy:</strong> Notice a missing showtime or release date shift? Reporting it helps update our live catalog.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Ideas Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Ideas You Can Suggest
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Add cinema theatre filters (IMAX, 4DX, ScreenX, PVR Gold Class)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  WhatsApp / SMS notification alerts for movie ticket openings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Support for more tier-2 and tier-3 multiplexes in regional cities
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  Dark mode toggle for late-night movie browsing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
