import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Mail, Globe, Sparkles } from 'lucide-react';

const TwitterIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Current URL or production domain
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zenkai.vercel.app';
  const shareTitle = 'ZENKAI – Movies & Music Events Discovery Platform';
  const shareText = 'Check out ZENKAI to discover now showing movies, upcoming 2026/2027 theatrical releases, live concerts, and book cinema tickets!';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      bg: 'bg-emerald-500 hover:bg-emerald-600',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`)}`,
    },
    {
      name: 'X (Twitter)',
      icon: TwitterIcon,
      bg: 'bg-slate-900 hover:bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      bg: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      bg: 'bg-sky-500 hover:bg-sky-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      bg: 'bg-indigo-600 hover:bg-indigo-700',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nExplore ZENKAI here: ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold mb-2 border border-white/10">
            <Share2 className="w-3.5 h-3.5" /> Share Website
          </div>
          <h3 className="text-xl font-black text-white">Share ZENKAI with Friends</h3>
          <p className="text-xs text-slate-300 mt-1">
            Invite friends, developers, and movie buffs to explore theatrical showtimes, upcoming releases, and concert tours.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Share URL Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Shareable Public Link
            </label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <Globe className="w-4 h-4 text-indigo-600 ml-2 flex-shrink-0" />
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-slate-800 outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Link copied to clipboard! Ready to paste and share.
              </p>
            )}
          </div>

          {/* Direct Social Channels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Share Directly Via
            </label>
            <div className="grid grid-cols-5 gap-2">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group text-center"
                    title={`Share on ${item.name}`}
                  >
                    <div className={`p-2.5 rounded-xl text-white ${item.bg} transition-transform group-hover:scale-110 shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 truncate w-full">
                      {item.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p>
              Visitors can freely explore all movie details, theatrical showtimes, upcoming calendars, and concert lineups without needing to create an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
