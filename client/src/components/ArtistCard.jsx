import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Radio, Users } from 'lucide-react';
import ArtistAvatar from './ArtistAvatar';

const ArtistCard = ({ artist }) => {
  if (!artist) return null;

  return (
    <Link
      to={`/artist/${artist.slug || artist._id}`}
      className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 ring-4 ring-slate-100 group-hover:ring-purple-200 transition-all shadow-md">
        <ArtistAvatar
          src={artist.image}
          name={artist.name}
          className="w-full h-full"
          imgClassName="group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
        {artist.name}
      </h3>

      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
        {artist.genres?.slice(0, 2).join(' • ') || 'Musician'}
      </p>

      <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
        <Radio className="w-3 h-3" />
        <span>{artist.monthlyListeners || '10M+'} listeners</span>
      </div>
    </Link>
  );
};

export default ArtistCard;
