import React, { useState } from 'react';
import { Film } from 'lucide-react';

const MoviePoster = ({
  src,
  alt = 'Movie Poster',
  title = '',
  className = '',
  aspectRatio = 'aspect-[2/3]',
  isBackdrop = false,
  loading = 'lazy',
}) => {
  const displayTitle = title || alt || 'ZENKAI Cinema';
  const [imgSrc, setImgSrc] = useState(src || '');
  const [retryStage, setRetryStage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setImgSrc(src || '');
    setRetryStage(0);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (retryStage === 0 && src && src.startsWith('/images/')) {
      // First retry for local image: point explicitly to backend server host if Vite proxy hasn't forwarded it
      setRetryStage(1);
      setImgSrc(`http://localhost:5001${src}`);
    } else if (retryStage === 0 && src && src.startsWith('http') && !src.includes('proxy-image')) {
      // First retry for external URL: route via backend proxy
      setRetryStage(1);
      setImgSrc(`/api/v1/movies/proxy-image?url=${encodeURIComponent(src)}`);
    } else {
      // Out of retries: render the dedicated movie title card (NEVER another movie's poster)
      setRetryStage(2);
      setImgSrc('');
    }
  };

  // If no source or error after retries, display dedicated movie title cinema card (NEVER another movie's poster)
  if (!imgSrc || retryStage >= 2) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex flex-col items-center justify-center p-4 text-center border border-white/10 ${aspectRatio} ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-3">
          <Film className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-xs font-bold text-slate-100 uppercase tracking-tight line-clamp-3 leading-snug">
          {displayTitle}
        </p>
        <span className="mt-2 text-[10px] font-semibold tracking-wider uppercase text-indigo-400/90 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/20">
          Theatrical Release
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${aspectRatio} ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <Film className="w-8 h-8 text-slate-700 animate-bounce" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={displayTitle}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
};

export default MoviePoster;
