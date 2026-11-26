import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  MapPin,
  Search,
  X,
  Check,
  Building2,
  Sparkles,
  RotateCcw,
  Navigation,
  Loader2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useCity } from '../context/CityContext';

// Helper component to highlight matching search characters
const HighlightMatch = ({ text, highlight }) => {
  if (!text) return null;
  if (!highlight || !highlight.trim()) return <span>{text}</span>;

  try {
    const escaped = highlight.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-indigo-600 bg-indigo-50 font-black rounded-xs px-0.5">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch (err) {
    return <span>{text}</span>;
  }
};

const CityModal = () => {
  const {
    selectedCity,
    selectedState,
    selectedCityData,
    selectCity,
    resetCity,
    searchIndianCities,
    cities,
    totalSearchableCities,
    isCityModalOpen,
    setIsCityModalOpen,
  } = useCity();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isValidating, setIsValidating] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  // Top popular entertainment hubs for quick chips
  const POPULAR_HUBS = [
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Bengaluru', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Chandigarh', state: 'Punjab' },
    { name: 'Dehradun', state: 'Uttarakhand' },
    { name: 'Varanasi', state: 'Uttar Pradesh' },
    { name: 'Patna', state: 'Bihar' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Srinagar', state: 'Jammu and Kashmir' },
  ];

  // Auto focus input on modal open
  useEffect(() => {
    if (isCityModalOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setActiveIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isCityModalOpen]);

  // Handle debounced search query against backend (4,200+ cities)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchIndianCities(query, 20);
      setSearchResults(results);
      setIsSearching(false);
      setActiveIndex(-1); // Do not auto-select first item
    }, 120);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchIndianCities]);

  if (!isCityModalOpen) return null;

  // Items to display: active search results or popular hubs
  const displayedItems = searchQuery.trim() ? searchResults : cities;

  // Handle city selection
  const handleSelectCity = async (cityItem) => {
    setIsValidating(true);
    try {
      await selectCity(cityItem, cityItem.state);
    } finally {
      setIsValidating(false);
    }
  };

  // Keyboard navigation handler (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev < displayedItems.length - 1 ? prev + 1 : prev;
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : -1;
        scrollToIndex(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && displayedItems[activeIndex]) {
        handleSelectCity(displayedItems[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCityModalOpen(false);
    }
  };

  const scrollToIndex = (index) => {
    if (listRef.current && index >= 0) {
      const itemEl = listRef.current.children[index];
      if (itemEl) {
        itemEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsCityModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">Select Your City</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                  All India ({totalSearchableCities.toLocaleString()}+ Cities)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Discover multiplexes, showtimes, and ticket prices across all Indian states & territories
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Metro Hub Chips */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Popular Entertainment Hubs
            </p>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Click any hub or search below
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1 scrollbar-none">
            {POPULAR_HUBS.map((hub) => {
              const isSelected =
                selectedCity.toLowerCase() === hub.name.toLowerCase() &&
                (!selectedState || selectedState.toLowerCase() === hub.state.toLowerCase());
              return (
                <button
                  key={`${hub.name}-${hub.state}`}
                  type="button"
                  onClick={() => handleSelectCity(hub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700'
                  }`}
                >
                  <span>{hub.name}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input Box with Real-time autocomplete */}
        <div className="mt-4 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Indian city (e.g. Lucknow, Delhi, Varanasi, Dehradun, Patna, Srinagar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm font-medium transition-all"
            />
            {isSearching ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 absolute right-3 top-1/2 -translate-y-1/2"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between px-1">
            <span>Use ↑ ↓ arrow keys to navigate suggestions, Enter to select</span>
            {searchQuery && (
              <span>
                {searchResults.length} matching {searchResults.length === 1 ? 'city' : 'cities'}
              </span>
            )}
          </p>
        </div>

        {/* City Results / Suggestions List */}
        <div
          ref={listRef}
          className="mt-2.5 overflow-y-auto pr-1 flex-1 space-y-1.5 max-h-[310px] min-h-[220px]"
        >
          {displayedItems.map((city, idx) => {
            const isSelected =
              selectedCity.toLowerCase() === city.name.toLowerCase() &&
              (!city.state || !selectedState || selectedState.toLowerCase() === city.state.toLowerCase());
            const isKeyboardActive = activeIndex === idx;

            return (
              <button
                key={`${city.name}-${city.state}-${idx}`}
                type="button"
                onClick={() => handleSelectCity(city)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isKeyboardActive
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/70 border-indigo-300'
                    : isSelected
                    ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <HighlightMatch text={city.name} highlight={searchQuery} />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      <HighlightMatch text={city.state} highlight={searchQuery} />, India
                      {city.cinemasCount ? (
                        <span className="text-slate-400 font-normal ml-1">
                          • {city.cinemasCount} {city.cinemasCount === 1 ? 'theatre' : 'theatres'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {city.isSupportedHub && (
                    <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50">
                      Major Hub
                    </span>
                  )}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Empty search results state */}
          {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                No cities found matching "{searchQuery}"
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Please check the spelling or search using another nearby city or district in India.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Active Location & Reset Button */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-slate-400">Current Location:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg font-bold text-slate-800">
              <MapPin className="w-3 h-3 text-indigo-600" />
              {selectedCity}, {selectedState || 'India'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={resetCity}
              className="px-3 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl font-semibold transition-all flex items-center gap-1"
              title="Reset selected city to Mumbai, Maharashtra"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Default
            </button>
            <button
              type="button"
              onClick={() => setIsCityModalOpen(false)}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityModal;