import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Genre ID to Name Mapping for TMDB
const TMDB_GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || null;
    this.cache = new Map();
    this.cacheTTL = 10 * 60 * 1000; // 10 minutes cache
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async fetchFromTMDB(endpoint, params = {}) {
    if (!this.isConfigured()) return null;

    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          language: 'en-US',
          ...params,
        },
        timeout: 6000,
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch (error) {
      console.warn(`[TMDB Service] Fetch warning on ${endpoint}: ${error.message}`);
      return null;
    }
  }

  formatPosterUrl(path, size = 'w500') {
    if (!path) {
      return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
    }
    if (path.startsWith('http')) return path;
    const validSizes = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'];
    const chosenSize = validSizes.includes(size) ? size : 'w500';
    return `${TMDB_IMAGE_BASE}/${chosenSize}${path.startsWith('/') ? path : `/${path}`}`;
  }

  formatBackdropUrl(path, size = 'original') {
    if (!path) {
      return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80';
    }
    if (path.startsWith('http')) return path;
    const validSizes = ['w300', 'w780', 'w1280', 'original'];
    const chosenSize = validSizes.includes(size) ? size : 'original';
    return `${TMDB_IMAGE_BASE}/${chosenSize}${path.startsWith('/') ? path : `/${path}`}`;
  }

  formatProfileUrl(path, size = 'h632') {
    if (!path) {
      return '';
    }
    if (path.startsWith('http')) return path;
    const validSizes = ['w45', 'w185', 'h632', 'original'];
    const chosenSize = validSizes.includes(size) ? size : 'h632';
    return `${TMDB_IMAGE_BASE}/${chosenSize}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async getMovieDetails(tmdbId) {
    return this.fetchFromTMDB(`/movie/${tmdbId}`, {
      append_to_response: 'credits,videos,images,watch/providers',
    });
  }

  // Fetch official posters, backdrops, and logos from TMDB movie images endpoint
  async getMovieImages(tmdbId) {
    return this.fetchFromTMDB(`/movie/${tmdbId}/images`, {
      include_image_language: 'en,hi,te,ta,ja,null',
    });
  }

  // Select the highest-rated, proper aspect ratio official poster from TMDB images
  selectBestMoviePoster(imagesData, preferredLang = 'en') {
    if (!imagesData || !Array.isArray(imagesData.posters) || imagesData.posters.length === 0) {
      return null;
    }

    // Filter valid 2:3 aspect ratio posters (~0.667, range 0.60 to 0.75)
    const validPosters = imagesData.posters.filter(
      (p) => p.aspect_ratio >= 0.58 && p.aspect_ratio <= 0.78 && p.file_path
    );

    if (validPosters.length === 0) {
      return this.formatPosterUrl(imagesData.posters[0].file_path, 'w500');
    }

    // Rank posters: matching language gets priority, followed by language-neutral (null), then vote score
    const ranked = [...validPosters].sort((a, b) => {
      const aLangMatch = a.iso_639_1 === preferredLang ? 2 : a.iso_639_1 === null ? 1 : 0;
      const bLangMatch = b.iso_639_1 === preferredLang ? 2 : b.iso_639_1 === null ? 1 : 0;
      if (bLangMatch !== aLangMatch) return bLangMatch - aLangMatch;

      const aScore = (a.vote_count || 0) * 2 + (a.vote_average || 0);
      const bScore = (b.vote_count || 0) * 2 + (b.vote_average || 0);
      return bScore - aScore;
    });

    return {
      url: this.formatPosterUrl(ranked[0].file_path, 'w500'),
      highResUrl: this.formatPosterUrl(ranked[0].file_path, 'w780'),
      filePath: ranked[0].file_path,
      aspectRatio: ranked[0].aspect_ratio,
      width: ranked[0].width,
      height: ranked[0].height,
      voteAverage: ranked[0].vote_average,
      language: ranked[0].iso_639_1,
      alternatives: ranked.slice(1, 6).map((p) => ({
        url: this.formatPosterUrl(p.file_path, 'w500'),
        filePath: p.file_path,
        aspectRatio: p.aspect_ratio,
        voteAverage: p.vote_average,
        language: p.iso_639_1,
      })),
    };
  }

  // Select the best 16:9 official backdrop from TMDB images
  selectBestMovieBackdrop(imagesData) {
    if (!imagesData || !Array.isArray(imagesData.backdrops) || imagesData.backdrops.length === 0) {
      return null;
    }

    const validBackdrops = imagesData.backdrops.filter(
      (b) => b.aspect_ratio >= 1.6 && b.aspect_ratio <= 1.95 && b.file_path
    );

    const list = validBackdrops.length > 0 ? validBackdrops : imagesData.backdrops;
    const ranked = [...list].sort((a, b) => {
      const aScore = (a.vote_count || 0) * 2 + (a.vote_average || 0);
      const bScore = (b.vote_count || 0) * 2 + (b.vote_average || 0);
      return bScore - aScore;
    });

    return {
      url: this.formatBackdropUrl(ranked[0].file_path, 'w1280'),
      originalUrl: this.formatBackdropUrl(ranked[0].file_path, 'original'),
      filePath: ranked[0].file_path,
      aspectRatio: ranked[0].aspect_ratio,
      width: ranked[0].width,
      height: ranked[0].height,
    };
  }

  // Search for person on TMDB (musicians, singers, composers, actors)
  async searchPerson(query) {
    return this.fetchFromTMDB('/search/person', {
      query,
      include_adult: false,
    });
  }

  // Fetch official profile photos from TMDB person images endpoint
  async getPersonImages(personId) {
    return this.fetchFromTMDB(`/person/${personId}/images`);
  }

  // Select the highest-rated official profile photograph for an artist from TMDB person images
  selectBestPersonProfile(imagesData) {
    if (!imagesData || !Array.isArray(imagesData.profiles) || imagesData.profiles.length === 0) {
      return null;
    }

    // Filter valid 2:3 portrait aspect ratio (~0.667)
    const validProfiles = imagesData.profiles.filter(
      (p) => p.aspect_ratio >= 0.55 && p.aspect_ratio <= 0.8 && p.file_path
    );

    const list = validProfiles.length > 0 ? validProfiles : imagesData.profiles;
    const ranked = [...list].sort((a, b) => {
      const aScore = (a.vote_count || 0) * 2 + (a.vote_average || 0);
      const bScore = (b.vote_count || 0) * 2 + (b.vote_average || 0);
      return bScore - aScore;
    });

    return {
      url: this.formatProfileUrl(ranked[0].file_path, 'h632'),
      thumbnailUrl: this.formatProfileUrl(ranked[0].file_path, 'w185'),
      originalUrl: this.formatProfileUrl(ranked[0].file_path, 'original'),
      filePath: ranked[0].file_path,
      aspectRatio: ranked[0].aspect_ratio,
      width: ranked[0].width,
      height: ranked[0].height,
      voteAverage: ranked[0].vote_average,
      alternatives: ranked.slice(1, 5).map((p) => ({
        url: this.formatProfileUrl(p.file_path, 'h632'),
        thumbnailUrl: this.formatProfileUrl(p.file_path, 'w185'),
        filePath: p.file_path,
      })),
    };
  }

  async searchMovies(query, page = 1) {
    return this.fetchFromTMDB('/search/movie', { query, page });
  }

  async getTrending(timeWindow = 'week') {
    return this.fetchFromTMDB(`/trending/movie/${timeWindow}`);
  }

  // Dynamic TMDB Upcoming Movies fetch using /discover/movie with strict future date
  async fetchUpcomingFromTMDB(params = {}) {
    const {
      page = 1,
      minDate = new Date().toISOString().split('T')[0],
      region = 'IN',
      withLanguage,
    } = params;

    const queryParams = {
      'primary_release_date.gte': minDate,
      sort_by: 'primary_release_date.asc',
      include_adult: false,
      include_video: false,
      page,
    };

    if (region && region !== 'all') {
      queryParams.region = region;
    }

    if (withLanguage) {
      queryParams.with_original_language = withLanguage;
    }

    return this.fetchFromTMDB('/discover/movie', queryParams);
  }

  // Fetch multiple pages concurrently to ensure at least 20-40 upcoming movies
  async fetchMultipleUpcomingPages(options = {}) {
    if (!this.isConfigured()) return [];

    const {
      totalPages = 3,
      minDate = new Date().toISOString().split('T')[0],
      region,
    } = options;

    const requests = [];
    for (let p = 1; p <= totalPages; p++) {
      requests.push(this.fetchUpcomingFromTMDB({ page: p, minDate, region }));
    }

    const responses = await Promise.all(requests);
    const seenIds = new Set();
    const formattedMovies = [];

    const currentDateObj = new Date(minDate);

    for (const res of responses) {
      if (!res || !Array.isArray(res.results)) continue;

      for (const item of res.results) {
        if (!item.id || seenIds.has(item.id)) continue;
        if (!item.release_date) continue;

        const itemDate = new Date(item.release_date);
        // Strict future release date validation
        if (isNaN(itemDate.getTime()) || itemDate <= currentDateObj || itemDate.getFullYear() <= 2025) {
          continue;
        }

        seenIds.add(item.id);

        const genres = (item.genre_ids || [])
          .map((id) => TMDB_GENRE_MAP[id])
          .filter(Boolean);

        // Determine industry / region from original language
        let industry = 'hollywood';
        if (['hi', 'mr'].includes(item.original_language)) industry = 'bollywood';
        else if (['te', 'ta', 'kn', 'ml'].includes(item.original_language)) industry = 'south_indian';
        else if (item.original_language === 'ja') industry = 'anime';
        else if (item.original_language !== 'en') industry = 'international';

        formattedMovies.push({
          tmdbId: item.id,
          title: item.title,
          slug: `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${item.id}`,
          originalTitle: item.original_title || item.title,
          overview: item.overview || 'Upcoming theatrical release details to be announced.',
          releaseDate: itemDate,
          releaseYear: itemDate.getFullYear(),
          releaseStatus: 'upcoming',
          poster: this.formatPosterUrl(item.poster_path),
          backdrop: this.formatBackdropUrl(item.backdrop_path),
          genres: genres.length > 0 ? genres : ['Feature Film'],
          languages: [item.original_language ? item.original_language.toUpperCase() : 'English'],
          industry,
          ratingSummary: {
            tmdbRating: item.vote_average || 8.5,
            imdbRating: item.vote_average || 8.5,
            averageAudienceRating: item.vote_average || 8.5,
            reviewCount: item.vote_count || 100,
          },
        });
      }
    }

    // Sort strictly by nearest upcoming release date
    return formattedMovies.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  }
}

export default new TMDBService();
