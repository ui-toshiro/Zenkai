import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CityContext = createContext();

export const DEFAULT_HUBS = [
  { name: 'Delhi', state: 'Delhi', fullName: 'Delhi, Delhi, India', cinemasCount: 42 },
  { name: 'Mumbai', state: 'Maharashtra', fullName: 'Mumbai, Maharashtra, India', cinemasCount: 38 },
  { name: 'Lucknow', state: 'Uttar Pradesh', fullName: 'Lucknow, Uttar Pradesh, India', cinemasCount: 16 },
  { name: 'Bengaluru', state: 'Karnataka', fullName: 'Bengaluru, Karnataka, India', cinemasCount: 35 },
  { name: 'Hyderabad', state: 'Telangana', fullName: 'Hyderabad, Telangana, India', cinemasCount: 29 },
  { name: 'Chennai', state: 'Tamil Nadu', fullName: 'Chennai, Tamil Nadu, India', cinemasCount: 24 },
  { name: 'Kolkata', state: 'West Bengal', fullName: 'Kolkata, West Bengal, India', cinemasCount: 20 },
  { name: 'Pune', state: 'Maharashtra', fullName: 'Pune, Maharashtra, India', cinemasCount: 22 },
  { name: 'Jaipur', state: 'Rajasthan', fullName: 'Jaipur, Rajasthan, India', cinemasCount: 14 },
  { name: 'Ahmedabad', state: 'Gujarat', fullName: 'Ahmedabad, Gujarat, India', cinemasCount: 18 },
  { name: 'Chandigarh', state: 'Punjab', fullName: 'Chandigarh, Punjab, India', cinemasCount: 12 },
  { name: 'Indore', state: 'Madhya Pradesh', fullName: 'Indore, Madhya Pradesh, India', cinemasCount: 11 },
  { name: 'Kochi', state: 'Kerala', fullName: 'Kochi, Kerala, India', cinemasCount: 12 },
  { name: 'Goa', state: 'Goa', fullName: 'Goa, Goa, India', cinemasCount: 8 },
  { name: 'Dehradun', state: 'Uttarakhand', fullName: 'Dehradun, Uttarakhand, India', cinemasCount: 9 },
  { name: 'Varanasi', state: 'Uttar Pradesh', fullName: 'Varanasi, Uttar Pradesh, India', cinemasCount: 8 },
  { name: 'Patna', state: 'Bihar', fullName: 'Patna, Bihar, India', cinemasCount: 9 },
  { name: 'Bhopal', state: 'Madhya Pradesh', fullName: 'Bhopal, Madhya Pradesh, India', cinemasCount: 10 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', fullName: 'Srinagar, Jammu and Kashmir, India', cinemasCount: 3 },
];

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('zenkai_selected_city') || 'Mumbai';
  });

  const [selectedState, setSelectedState] = useState(() => {
    return localStorage.getItem('zenkai_selected_state') || 'Maharashtra';
  });

  const [selectedCityData, setSelectedCityData] = useState(() => {
    try {
      const saved = localStorage.getItem('zenkai_selected_city_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore JSON parse error
    }
    return {
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      fullName: 'Mumbai, Maharashtra, India',
      cinemasCount: 38,
    };
  });

  const [cities, setCities] = useState(DEFAULT_HUBS);
  const [totalSearchableCities, setTotalSearchableCities] = useState(4200);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch popular cities & total count on load
  useEffect(() => {
    const fetchCityHubs = async () => {
      try {
        setLoadingCities(true);
        const res = await api.get('/movies/tickets/cities');
        if (res.data.success && res.data.cities?.length) {
          setCities(res.data.cities);
          if (res.data.totalSearchableCities) {
            setTotalSearchableCities(res.data.totalSearchableCities);
          }
        }
      } catch (err) {
        // Fallback to DEFAULT_HUBS
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCityHubs();

    // Listen to cross-component or cross-tab city change events
    const handleStorageChange = (e) => {
      if (e.key === 'zenkai_selected_city' && e.newValue) {
        setSelectedCity(e.newValue);
        const savedState = localStorage.getItem('zenkai_selected_state');
        if (savedState) setSelectedState(savedState);
      }
    };

    const handleCustomCityChange = (e) => {
      if (e.detail?.city) {
        setSelectedCity(e.detail.city);
        if (e.detail.state) setSelectedState(e.detail.state);
        if (e.detail.data) setSelectedCityData(e.detail.data);
      } else if (typeof e.detail === 'string') {
        setSelectedCity(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('zenkaiCityChange', handleCustomCityChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('zenkaiCityChange', handleCustomCityChange);
    };
  }, []);

  // Async search for cities against 4,200+ Indian database
  const searchIndianCities = useCallback(async (query, limit = 15) => {
    try {
      const res = await api.get(
        `/movies/cities/search?q=${encodeURIComponent(query || '')}&limit=${limit}`
      );
      if (res.data.success) {
        return res.data.cities || [];
      }
      return [];
    } catch (err) {
      console.error('[CitySearch Error]', err);
      return [];
    }
  }, []);

  // Select and validate a city
  const selectCity = useCallback(
    async (cityItemOrName, stateName = '') => {
      let candidateName = '';
      let candidateState = stateName;
      let cityRecord = null;

      if (typeof cityItemOrName === 'object' && cityItemOrName !== null) {
        candidateName = cityItemOrName.name || '';
        candidateState = cityItemOrName.state || candidateState;
        cityRecord = cityItemOrName;
      } else if (typeof cityItemOrName === 'string') {
        candidateName = cityItemOrName.trim();
      }

      if (!candidateName) return;

      try {
        // Validate against backend verified Indian cities registry
        const res = await api.get(
          `/movies/cities/validate?city=${encodeURIComponent(candidateName)}&state=${encodeURIComponent(
            candidateState
          )}`
        );

        if (res.data.success && res.data.isValid && res.data.city) {
          const validated = res.data.city;
          const cleanCity = validated.name;
          const cleanState = validated.state;

          setSelectedCity(cleanCity);
          setSelectedState(cleanState);
          setSelectedCityData(validated);

          localStorage.setItem('zenkai_selected_city', cleanCity);
          localStorage.setItem('zenkai_selected_state', cleanState);
          localStorage.setItem('zenkai_selected_city_data', JSON.stringify(validated));

          // Also ensure it is present in local quick selection list
          setCities((prev) => {
            if (prev.some((c) => c.name.toLowerCase() === cleanCity.toLowerCase() && c.state.toLowerCase() === cleanState.toLowerCase())) {
              return prev;
            }
            return [validated, ...prev.slice(0, 20)];
          });

          setIsCityModalOpen(false);

          window.dispatchEvent(
            new CustomEvent('zenkaiCityChange', {
              detail: { city: cleanCity, state: cleanState, data: validated },
            })
          );
          return true;
        } else {
          // If not confirmed in backend registry, still allow with structured fallback
          const fallbackData = cityRecord || {
            name: candidateName,
            state: candidateState || 'India',
            country: 'India',
            fullName: `${candidateName}, ${candidateState || 'India'}, India`,
            cinemasCount: 4,
          };
          setSelectedCity(candidateName);
          setSelectedState(fallbackData.state);
          setSelectedCityData(fallbackData);

          localStorage.setItem('zenkai_selected_city', candidateName);
          localStorage.setItem('zenkai_selected_state', fallbackData.state);
          localStorage.setItem('zenkai_selected_city_data', JSON.stringify(fallbackData));

          setIsCityModalOpen(false);
          window.dispatchEvent(
            new CustomEvent('zenkaiCityChange', {
              detail: { city: candidateName, state: fallbackData.state, data: fallbackData },
            })
          );
          return true;
        }
      } catch (err) {
        console.error('[City Validation Error]', err);
        // Fallback set
        setSelectedCity(candidateName);
        localStorage.setItem('zenkai_selected_city', candidateName);
        setIsCityModalOpen(false);
        return false;
      }
    },
    []
  );

  // Reset to default city (Mumbai, Maharashtra)
  const resetCity = useCallback(() => {
    const defaultData = {
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      fullName: 'Mumbai, Maharashtra, India',
      cinemasCount: 38,
    };
    setSelectedCity('Mumbai');
    setSelectedState('Maharashtra');
    setSelectedCityData(defaultData);

    localStorage.setItem('zenkai_selected_city', 'Mumbai');
    localStorage.setItem('zenkai_selected_state', 'Maharashtra');
    localStorage.setItem('zenkai_selected_city_data', JSON.stringify(defaultData));

    setIsCityModalOpen(false);

    window.dispatchEvent(
      new CustomEvent('zenkaiCityChange', {
        detail: { city: 'Mumbai', state: 'Maharashtra', data: defaultData },
      })
    );
  }, []);

  return (
    <CityContext.Provider
      value={{
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
        loadingCities,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};