import React, { useState, useEffect } from 'react';
import { Mic2, User } from 'lucide-react';

const ArtistAvatar = ({
  src,
  name = 'Artist',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  isLarge = false,
}) => {
  const [imgSrc, setImgSrc] = useState(src || '');
  const [hasTriedProxy, setHasTriedProxy] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const fallbackDicebear = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7c3aed,6d28d9,5b21b6&textColor=ffffff`;

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasTriedProxy(false);
      setIsLoaded(false);
      setHasFailedAll(false);
    } else {
      setImgSrc(fallbackDicebear);
      setIsLoaded(true);
    }
  }, [src, name]);

  const handleError = () => {
    // If original source was external and hasn't tried proxy yet, route through backend proxy
    if (!hasTriedProxy && src && src.startsWith('http') && !src.includes('proxy-image')) {
      setHasTriedProxy(true);
      setImgSrc(`/api/v1/artists/proxy-image?url=${encodeURIComponent(src)}`);
    } else {
      setHasFailedAll(true);
      setImgSrc(fallbackDicebear);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-full bg-slate-800 flex-shrink-0 ${className}`}>
      {/* Skeleton Pulse */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center z-10">
          {isLarge ? (
            <Mic2 className="w-12 h-12 text-slate-600 animate-pulse" />
          ) : (
            <User className="w-6 h-6 text-slate-600" />
          )}
        </div>
      )}

      <img
        src={imgSrc}
        alt={name}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};

export default ArtistAvatar;
