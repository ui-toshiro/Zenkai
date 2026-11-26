import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Film,
  Users,
  MessageSquare,
  AlertTriangle,
  Check,
  Trash2,
  EyeOff,
  Sparkles,
  Lightbulb,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback'); // default to feedback tab

  // Feedback Filter State
  const [feedbackStatus, setFeedbackStatus] = useState('All');
  const [feedbackCategory, setFeedbackCategory] = useState('All');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchFeedback();
    }
  }, [isAdmin, feedbackStatus, feedbackCategory]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, flaggedRes, moviesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/flagged-reviews'),
        api.get('/movies/search?limit=20'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (flaggedRes.data.success) setFlaggedReviews(flaggedRes.data.reviews);
      if (moviesRes.data.success) setMovies(moviesRes.data.movies);
    } catch (err) {
      console.error('[Admin Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const params = {};
      if (feedbackStatus && feedbackStatus !== 'All') params.status = feedbackStatus;
      if (feedbackCategory && feedbackCategory !== 'All') params.category = feedbackCategory;
      if (feedbackSearch.trim()) params.search = feedbackSearch.trim();

      const [fbRes, fbStatsRes] = await Promise.all([
        api.get('/feedback', { params }),
        api.get('/feedback/stats'),
      ]);

      if (fbRes.data.success) setFeedbackList(fbRes.data.feedback || []);
      if (fbStatsRes.data.success) setFeedbackStats(fbStatsRes.data.stats);
    } catch (err) {
      console.error('[Feedback Fetch Error]', err);
    }
  };

  const handleFeedbackSearchSubmit = (e) => {
    e.preventDefault();
    fetchFeedback();
  };

  const handleUpdateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const res = await api.put(`/feedback/${feedbackId}`, { status: newStatus });
      if (res.data.success) {
        setFeedbackList((prev) =>
          prev.map((fb) => (fb._id === feedbackId ? { ...fb, status: newStatus } : fb))
        );
        fetchFeedback();
      }
    } catch (err) {
      alert('Error updating feedback status');
    }
  };

  const handleSaveNotes = async (feedbackId) => {
    try {
      const res = await api.put(`/feedback/${feedbackId}`, { adminNotes: notesInput });
      if (res.data.success) {
        setFeedbackList((prev) =>
          prev.map((fb) => (fb._id === feedbackId ? { ...fb, adminNotes: notesInput } : fb))
        );
        setEditingNotesId(null);
        setNotesInput('');
      }
    } catch (err) {
      alert('Error saving admin notes');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) return;
    try {
      const res = await api.delete(`/feedback/${feedbackId}`);
      if (res.data.success) {
        setFeedbackList((prev) => prev.filter((fb) => fb._id !== feedbackId));
        fetchFeedback();
      }
    } catch (err) {
      alert('Error deleting feedback');
    }
  };

  const handleModerateReview = async (reviewId, action) => {
    try {
      const res = await api.put(`/admin/reviews/${reviewId}/moderate`, { action });
      if (res.data.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      alert('Error updating review');
    }
  };

  const handleToggleFeature = async (movieId, field) => {
    try {
      const res = await api.put(`/admin/movies/${movieId}/toggle-feature`, { field });
      if (res.data.success) {
        setMovies((prev) =>
          prev.map((m) => (m._id === movieId ? res.data.movie : m))
        );
      }
    } catch (err) {
      alert('Error updating movie feature');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-sm">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Admin Access Required</h2>
        <p className="text-xs text-slate-500 mb-4">
          You must be logged in as an administrator to access the moderation console.
        </p>
        <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
          Return to Cinema
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'in_progress':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-lg">🛡️</span>
          <h1 className="text-2xl font-black text-slate-900">Admin Moderation & Insights Console</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review community feedback, triage visitor suggestions, moderate reviews, and curate featured spotlight movies.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Visitor Suggestions</span>
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{feedbackStats?.total || feedbackList.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {feedbackStats?.new || 0} pending review
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Films</span>
            <Film className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.movieCount || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active database roster</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.userCount || 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">Community members</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Reported Reviews</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{flaggedReviews.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending moderation</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Visitor Suggestions & Feedback ({feedbackStats?.total || feedbackList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'moderation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reported Reviews ({flaggedReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'movies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Curated Movie Spotlight</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: VISITOR FEEDBACK & SUGGESTIONS DASHBOARD
      ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Category / Status Filters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <form onSubmit={handleFeedbackSearchSubmit} className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search suggestions by keyword, visitor name, or email..."
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Category:</span>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="UI/UX Improvements">UI/UX Improvements</option>
                  <option value="New Features">New Features</option>
                  <option value="Bug Reports">Bug Reports</option>
                  <option value="Performance">Performance</option>
                  <option value="General Suggestions">General Suggestions</option>
                </select>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 mr-1">Status Filter:</span>
              {['All', 'new', 'reviewed', 'in_progress', 'resolved'].map((st) => {
                const isSelected = feedbackStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => setFeedbackStatus(st)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all capitalize ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {st === 'All' ? 'All Statuses' : st.replace('_', ' ')}
                    {st === 'new' && feedbackStats?.new > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px]">
                        {feedbackStats.new}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Items List */}
          {feedbackList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
              <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No Feedback Matches Current Filter</h3>
              <p className="text-xs text-slate-500">
                Visitor suggestions submitted through the public feedback form will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackList.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  {/* Top Row: Category, Rating & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating || 5} / 5</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide capitalize ${getStatusBadge(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Update Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateFeedbackStatus(item._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none capitalize"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => handleDeleteFeedback(item._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Suggestion Body */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    "{item.suggestion}"
                  </div>

                  {/* Admin Notes Section */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-slate-500">
                      <span>Submitted by:</span>
                      <strong className="text-slate-800">{item.name || 'Anonymous Visitor'}</strong>
                      {item.email && <span className="text-slate-400">({item.email})</span>}
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="w-full sm:w-auto">
                      {editingNotesId === item._id ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Add internal action note..."
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-full sm:w-60"
                          />
                          <button
                            onClick={() => handleSaveNotes(item._id)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {item.adminNotes ? (
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-[11px] border border-indigo-100">
                              Note: {item.adminNotes}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No notes added</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingNotesId(item._id);
                              setNotesInput(item.adminNotes || '');
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            title="Edit Admin Note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: REPORTED REVIEWS MODERATION QUEUE
      ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {flaggedReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Moderation Queue is Clean</h3>
              <p className="text-xs text-slate-400 mt-0.5">No reported reviews pending action.</p>
            </div>
          ) : (
            flaggedReviews.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Reported {r.reportCount || 1}x
                    </span>
                    <span className="text-xs text-slate-500">by community members</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">{r.rating} / 10 ★</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                  <p className="font-semibold mb-1">"{r.title || 'Untitled Review'}"</p>
                  <p>{r.content}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    Reviewer: <span className="font-semibold text-slate-700">{r.user?.name}</span> ({r.user?.email})
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerateReview(r._id, 'approve')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Clear
                    </button>
                    <button
                      onClick={() => handleModerateReview(r._id, 'hide')}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Hide
                    </button>
                    <button
                      onClick={() => handleModerateReview(r._id, 'delete')}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Permanently Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: CURATED MOVIE SPOTLIGHT TOGGLES
      ========================================================================= */}
      {activeTab === 'movies' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
            Movie Spotlight Toggles
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {movies.map((m) => (
              <div key={m._id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={m.poster} alt={m.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                    <p className="text-slate-400 text-[11px]">
                      {m.releaseYear} • {m.industry} • {m.genres?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeature(m._id, 'featured')}
                    className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                      m.featured ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Featured: {m.featured ? 'Yes' : 'No'}
                  </button>
                  <button
                    onClick={() => handleToggleFeature(m._id, 'trending')}
                    className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                      m.trending ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Trending: {m.trending ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
