import React, { useState } from 'react';
import { User } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Distinct pastel color gradients for initials
const avatarGradients = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-fuchsia-600',
];

const getGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
};

const CastAvatar = ({
  src,
  name = 'Cast Member',
  size = 'w-20 h-20',
  className = '',
  imgClassName = '',
}) => {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [hasFailed, setHasFailed] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasFailed(false);
      setIsLoaded(false);
    } else {
      setHasFailed(true);
    }
  }, [src]);

  const handleError = () => {
    // If not already tried via proxy, try once
    if (src && src.startsWith('http') && !imgSrc.includes('/proxy-image')) {
      setImgSrc(`http://localhost:5001/api/v1/movies/proxy-image?url=${encodeURIComponent(src)}`);
    } else {
      setHasFailed(true);
    }
  };

  const initials = getInitials(name);
  const gradient = getGradient(name);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 bg-slate-200 shadow-sm ${size} ${className}`}
    >
      {!hasFailed ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <img
            src={imgSrc}
            alt={name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${imgClassName}`}
          />
        </>
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-black text-sm tracking-wide select-none shadow-inner`}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default CastAvatar;
