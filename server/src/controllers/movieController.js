import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import tmdbService from '../services/tmdbService.js';
import cityService from '../services/cityService.js';
import { syncMoviePosters } from '../services/mediaSyncService.js';
import { serverCache } from '../utils/cache.js';
import https from 'https';
import http from 'http';

// Helper to sanitize regex query
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// Optimized listing fields: strictly exclude cast, crew, and heavy showtimes to minimize payload and boost loading speed
export const LISTING_FIELDS =
  'title slug poster backdrop genres languages certification runtime ratingSummary releaseStatus releaseDate releaseYear director popular featured trending ticketPricing country industry trailers';

// Helper to normalize city names across variations (Delhi vs Delhi NCR, Bangalore vs Bengaluru, etc.)
export const normalizeCity = (city) => {
  if (!city) return 'Mumbai';
  const c = city.trim().toLowerCase();
  if (c.includes('delhi') || c === 'ncr' || c.includes('gurgaon') || c.includes('noida')) return 'Delhi';
  if (c.includes('mumbai') || c.includes('bombay') || c.includes('thane') || c.includes('navi mumbai')) return 'Mumbai';
  if (c.includes('lucknow')) return 'Lucknow';
  if (c.includes('bangalore') || c.includes('bengaluru')) return 'Bengaluru';
  if (c.includes('hyderabad') || c.includes('secunderabad')) return 'Hyderabad';
  if (c.includes('chennai') || c.includes('madras')) return 'Chennai';
  if (c.includes('kolkata') || c.includes('calcutta')) return 'Kolkata';
  if (c.includes('pune')) return 'Pune';
  if (c.includes('ahmedabad') || c.includes('amdavad')) return 'Ahmedabad';
  if (c.includes('jaipur')) return 'Jaipur';
  if (c.includes('chandigarh') || c.includes('mohali') || c.includes('panchkula')) return 'Chandigarh';
  if (c.includes('indore')) return 'Indore';
  if (c.includes('kochi') || c.includes('cochin') || c.includes('ernakulam')) return 'Kochi';
  if (c.includes('goa') || c.includes('panaji') || c.includes('margao')) return 'Goa';
  return city.charAt(0).toUpperCase() + city.slice(1);
};

// Helper to retrieve dynamic date bounds for theatrical filtering
export const getTheatricalDateBounds = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const in30Days = new Date(startOfToday.getTime() + 30 * 24 * 60 * 60 * 1000);
  return { now, startOfToday, in30Days };
};

// Base filter for active theatrical movies: strictly now showing in cinemas OR upcoming from startOfToday onward
export const getActiveTheatricalFilter = () => {
  const { startOfToday } = getTheatricalDateBounds();
  return {
    $or: [
      { releaseStatus: 'now_showing' },
      { releaseStatus: 'upcoming', releaseDate: { $gte: startOfToday } },
    ],
  };
};

// @desc Get 4 dedicated theatrical categories: Now Showing, Releasing Soon (Next 30 Days), Upcoming (> 30 Days), and Coming in 2027
// @route GET /api/v1/movies/theatrical/categories
export const getTheatricalCategories = async (req, res, next) => {
  try {
    const { city = 'Mumbai', state = '' } = req.query;
    const { now, startOfToday, in30Days } = getTheatricalDateBounds();

    const validation = cityService.validateCity(city, state);
    const cityName = validation.isValid ? validation.city.name : normalizeCity(city);
    const stateName = validation.isValid ? validation.city.state : (state || 'India');
    const normalizedTarget = cityName.toLowerCase();

    const cacheKey = `theatrical_categories_${cityName}`;
    const cached = serverCache.get(cacheKey);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    if (cached) {
      return res.status(200).json(cached);
    }

    const [nowShowingRaw, releasingSoonRaw, upcomingRaw, coming2027Raw] = await Promise.all([
      // 1. Now Showing: Movies with active cinema showtimes
      Movie.find({ releaseStatus: 'now_showing' })
        .select(LISTING_FIELDS + ' cityShowtimes')
        .lean()
        .sort({ popular: -1, 'ratingSummary.imdbRating': -1 }),

      // 2. Releasing Soon: Theatrical release within next 30 days
      Movie.find({
        releaseStatus: 'upcoming',
        releaseDate: { $gte: startOfToday, $lte: in30Days },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 }),

      // 3. Upcoming Movies: Theatrical release further out (> 30 days)
      Movie.find({
        releaseStatus: 'upcoming',
        releaseDate: { $gt: in30Days },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 }),

      // 4. Coming in 2027: Verified 2027 theatrical releases
      Movie.find({
        releaseStatus: 'upcoming',
        releaseYear: 2027,
        releaseDate: { $gte: startOfToday },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 }),
    ]);

    // Format Now Showing movies with city-specific active showtime verification
    const formattedNowShowing = nowShowingRaw.map((m) => {
      const cityData = m.cityShowtimes?.find((cs) => {
        if (!cs || !cs.city) return false;
        const normCs = normalizeCity(cs.city).toLowerCase();
        return normCs === normalizedTarget || cs.city.toLowerCase() === normalizedTarget;
      });

      const theatres = cityData && cityData.theatres ? cityData.theatres : [];
      const hasShowtimesInCity = theatres && theatres.length > 0;

      // Safe clean copy without cityShowtimes payload
      const { cityShowtimes, ...cleanMovie } = m;
      return {
        ...cleanMovie,
        isShowingInCity: hasShowtimesInCity,
        theatreCountInCity: theatres.length,
        theatres: hasShowtimesInCity ? theatres.slice(0, 3) : [],
        startingPrice:
          hasShowtimesInCity && theatres[0]?.showDates?.[0]?.shows?.[0]?.seatCategories?.[0]?.price
            ? theatres[0].showDates[0].shows[0].seatCategories[0].price
            : null,
      };
    });

    const categories = {
      nowShowing: {
        id: 'now_showing',
        title: 'Now Showing in Cinemas',
        description: `Active cinema showtimes across multiplexes & IMAX screens in ${cityName}`,
        count: formattedNowShowing.length,
        showingInSelectedCityCount: formattedNowShowing.filter((m) => m.isShowingInCity).length,
        movies: formattedNowShowing,
      },
      releasingSoon: {
        id: 'releasing_soon',
        title: 'Releasing Soon (Next 30 Days)',
        description: 'Scheduled for theatrical premiere within the next 30 days',
        count: releasingSoonRaw.length,
        movies: releasingSoonRaw,
      },
      upcoming: {
        id: 'upcoming',
        title: 'Upcoming Theatrical Releases',
        description: 'Scheduled for theatrical release further out in 2026 and future years',
        count: upcomingRaw.length,
        movies: upcomingRaw,
      },
      comingIn2027: {
        id: 'coming_2027',
        title: 'Coming in 2027',
        description: 'Verified 2027 theatrical blockbuster calendar',
        count: coming2027Raw.length,
        movies: coming2027Raw,
      },
    };

    const responsePayload = {
      success: true,
      currentDate: now.toISOString(),
      city: cityName,
      state: stateName,
      categories,
    };

    serverCache.set(cacheKey, responsePayload, 60000);
    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @desc Get all discovery sections for Homepage (enforcing active theatrical filters)
// @route GET /api/v1/movies/discovery
export const getDiscoverySections = async (req, res, next) => {
  try {
    const cacheKey = 'movie_discovery_sections_theatrical';
    const cachedData = serverCache.get(cacheKey);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    if (cachedData) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedData,
      });
    }

    const { now, startOfToday, in30Days } = getTheatricalDateBounds();
    const activeTheatricalFilter = getActiveTheatricalFilter();

    const [
      featured,
      trending,
      nowShowing,
      releasingSoon,
      upcoming,
      comingIn2027,
      popular,
      topRated,
      bollywood,
      hollywood,
      southIndian,
      anime,
      latestReviews,
    ] = await Promise.all([
      // 1. Featured Movies (strictly active theatrical)
      Movie.find({ featured: true, ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 2. Trending Movies (strictly active theatrical)
      Movie.find({ trending: true, ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 3. Now Showing in Cinemas
      Movie.find({ releaseStatus: 'now_showing' })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 4. Releasing Soon (Next 30 Days)
      Movie.find({
        releaseStatus: 'upcoming',
        releaseDate: { $gte: startOfToday, $lte: in30Days },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 })
        .limit(8),
      // 5. Upcoming Movies (> 30 Days)
      Movie.find({
        releaseStatus: 'upcoming',
        releaseDate: { $gt: in30Days },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 })
        .limit(20),
      // 6. Coming in 2027 (Verified 2027 theatrical releases)
      Movie.find({
        releaseStatus: 'upcoming',
        releaseYear: 2027,
        releaseDate: { $gte: startOfToday },
      })
        .select(LISTING_FIELDS)
        .lean()
        .sort({ releaseDate: 1 })
        .limit(12),
      // 7. Popular Movies (strictly active theatrical)
      Movie.find({ popular: true, ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 8. Top-Rated Movies (strictly active theatrical)
      Movie.find(activeTheatricalFilter)
        .select(LISTING_FIELDS)
        .lean()
        .sort({ 'ratingSummary.imdbRating': -1, 'ratingSummary.averageAudienceRating': -1 })
        .limit(8),
      // 9. Bollywood Active Theatrical
      Movie.find({ industry: 'bollywood', ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 10. Hollywood Active Theatrical
      Movie.find({ industry: 'hollywood', ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 11. South Indian Active Theatrical
      Movie.find({ industry: 'south_indian', ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 12. Anime Active Theatrical
      Movie.find({ industry: 'anime', ...activeTheatricalFilter })
        .select(LISTING_FIELDS)
        .lean()
        .limit(8),
      // 13. Latest Movie Reviews
      Review.find({ status: 'approved' })
        .populate('movie', 'title poster slug releaseYear ratingSummary')
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .lean()
        .limit(6),
    ]);

    const resultData = {
      featured,
      trending,
      nowShowing,
      releasingSoon,
      upcoming,
      comingIn2027,
      popular,
      topRated,
      bollywood,
      hollywood,
      southIndian,
      anime,
      latestReviews,
    };

    serverCache.set(cacheKey, resultData, 60000); // Cache for 60 seconds

    res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Search & Filter movies
// @route GET /api/v1/movies/search
export const searchMovies = async (req, res, next) => {
  try {
    const {
      q,
      category,
      genre,
      language,
      industry,
      status,
      year,
      minRating,
      sortBy = 'relevance',
      page = 1,
      limit = 16,
    } = req.query;

    const { now, startOfToday, in30Days } = getTheatricalDateBounds();
    const andClauses = [];

    // Theatrical active status / category filter:
    const activeCategory = category || status;
    if (activeCategory === 'now_showing') {
      andClauses.push({ releaseStatus: 'now_showing' });
    } else if (activeCategory === 'releasing_soon') {
      andClauses.push({
        releaseStatus: 'upcoming',
        releaseDate: { $gte: startOfToday, $lte: in30Days },
      });
    } else if (activeCategory === 'upcoming') {
      andClauses.push({
        releaseStatus: 'upcoming',
        releaseDate: { $gt: in30Days },
      });
    } else if (activeCategory === 'coming_2027') {
      andClauses.push({
        releaseStatus: 'upcoming',
        releaseYear: 2027,
        releaseDate: { $gte: startOfToday },
      });
    } else {
      // Base theatrical filter: strictly now showing or upcoming from startOfToday onward
      andClauses.push({
        $or: [
          { releaseStatus: 'now_showing' },
          { releaseStatus: 'upcoming', releaseDate: { $gte: startOfToday } },
        ],
      });
    }

    // Text search query across Title, Director, Cast, Genres
    if (q && q.trim()) {
      const regex = new RegExp(escapeRegex(q.trim()), 'i');
      andClauses.push({
        $or: [
          { title: regex },
          { director: regex },
          { 'cast.name': regex },
          { genres: regex },
          { languages: regex },
        ],
      });
    }

    if (genre && genre !== 'All') {
      andClauses.push({ genres: { $in: [genre] } });
    }

    if (language && language !== 'All') {
      andClauses.push({ languages: { $in: [language] } });
    }

    if (industry && industry !== 'All') {
      andClauses.push({ industry });
    }

    if (year && year !== 'All') {
      andClauses.push({ releaseYear: parseInt(year, 10) });
    }

    if (minRating) {
      const min = parseFloat(minRating);
      andClauses.push({
        $or: [
          { 'ratingSummary.averageAudienceRating': { $gte: min } },
          { 'ratingSummary.imdbRating': { $gte: min } },
        ],
      });
    }

    const queryFilter = andClauses.length > 0 ? { $and: andClauses } : {};

    // Sort order
    let sort = {};
    if (sortBy === 'rating_desc') {
      sort = { 'ratingSummary.imdbRating': -1, 'ratingSummary.averageAudienceRating': -1 };
    } else if (sortBy === 'year_desc') {
      sort = { releaseYear: -1 };
    } else if (sortBy === 'year_asc') {
      sort = { releaseYear: 1 };
    } else if (sortBy === 'title_asc') {
      sort = { title: 1 };
    } else if (sortBy === 'releaseDate_asc') {
      sort = { releaseDate: 1 };
    } else {
      sort = { featured: -1, trending: -1, 'ratingSummary.imdbRating': -1 };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Movie.countDocuments(queryFilter);
    const movies = await Movie.find(queryFilter)
      .select(LISTING_FIELDS)
      .lean()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get upcoming movies with rich filtering, categories and pagination
// @route GET /api/v1/movies/upcoming
export const getUpcomingMovies = async (req, res, next) => {
  try {
    const {
      q,
      category = 'all',
      genre,
      language,
      industry,
      region,
      timeframe,
      sortBy = 'releaseDate_asc',
      page = 1,
      limit = 20,
    } = req.query;

    const cacheKey = `upcoming_${category}_${genre || 'All'}_${language || 'All'}_${industry || region || 'All'}_${timeframe || 'All'}_${sortBy}_${page}_${limit}_${q || ''}`;
    const cached = serverCache.get(cacheKey);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    if (cached) {
      return res.status(200).json(cached);
    }

    const { now, startOfToday, in30Days } = getTheatricalDateBounds();

    // Base filter: STRICTLY genuine upcoming films with future release dates from startOfToday onward
    const andClauses = [
      { releaseStatus: 'upcoming' },
      { releaseDate: { $gte: startOfToday } },
    ];

    // Category filter:
    if (category && category !== 'all') {
      if (category === 'releasing_soon') {
        andClauses.push({ releaseDate: { $gte: startOfToday, $lte: in30Days } });
      } else if (category === 'upcoming_later' || category === 'upcoming_30_plus') {
        andClauses.push({ releaseDate: { $gt: in30Days } });
      } else if (category === '2026') {
        const end2026 = new Date('2026-12-31T23:59:59.999Z');
        andClauses.push({ releaseDate: { $gte: startOfToday, $lte: end2026 }, releaseYear: 2026 });
      } else if (category === '2027') {
        andClauses.push({ releaseYear: 2027 });
      } else if (category === '2028_plus') {
        andClauses.push({ releaseYear: { $gte: 2028 } });
      } else if (category === 'bollywood') {
        andClauses.push({ industry: 'bollywood' });
      } else if (category === 'hollywood') {
        andClauses.push({ industry: 'hollywood' });
      } else if (category === 'south_indian') {
        andClauses.push({ industry: 'south_indian' });
      } else if (category === 'international') {
        andClauses.push({
          $or: [
            { industry: 'anime' },
            { country: { $nin: ['India', 'United States'] } },
            { languages: { $in: ['Japanese', 'Korean', 'Spanish', 'French', 'German'] } },
          ],
        });
      }
    }

    // Text search query across Title, Director, Cast, Genres
    if (q && q.trim()) {
      const regex = new RegExp(escapeRegex(q.trim()), 'i');
      andClauses.push({
        $or: [
          { title: regex },
          { director: regex },
          { 'cast.name': regex },
          { genres: regex },
          { languages: regex },
        ],
      });
    }

    if (genre && genre !== 'All') {
      andClauses.push({ genres: { $in: [genre] } });
    }

    if (language && language !== 'All') {
      andClauses.push({ languages: { $in: [language] } });
    }

    const selectedIndustry = industry || region;
    if (selectedIndustry && selectedIndustry !== 'All') {
      andClauses.push({ industry: selectedIndustry });
    }

    // Timeframe filters
    if (timeframe === 'this_month') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      andClauses.push({ releaseDate: { $gte: startOfToday, $lte: endOfMonth } });
    } else if (timeframe === 'next_3_months') {
      const next3Months = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate(), 23, 59, 59);
      andClauses.push({ releaseDate: { $gte: startOfToday, $lte: next3Months } });
    } else if (timeframe === 'this_year') {
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      andClauses.push({ releaseDate: { $gte: startOfToday, $lte: endOfYear } });
    }

    const queryFilter = { $and: andClauses };

    // Sort order: default nearest upcoming releases first
    let sort = { releaseDate: 1 };
    if (sortBy === 'releaseDate_desc') {
      sort = { releaseDate: -1 };
    } else if (sortBy === 'popularity') {
      sort = { popular: -1, trending: -1, releaseDate: 1 };
    } else if (sortBy === 'title_asc') {
      sort = { title: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Base upcoming query for active categories counting
    const baseUpcomingCondition = {
      releaseStatus: 'upcoming',
      releaseDate: { $gte: startOfToday },
    };

    const end2026Date = new Date('2026-12-31T23:59:59.999Z');

    const [
      total,
      movies,
      allGenres,
      allLanguages,
      totalUpcomingCount,
      releasingSoonCount,
      upcomingLaterCount,
      count2026,
      count2027,
      count2028Plus,
      bollywoodCount,
      hollywoodCount,
      southIndianCount,
      internationalCount,
    ] = await Promise.all([
      Movie.countDocuments(queryFilter),
      Movie.find(queryFilter).select(LISTING_FIELDS).lean().sort(sort).skip(skip).limit(limitNum),
      Movie.distinct('genres', baseUpcomingCondition),
      Movie.distinct('languages', baseUpcomingCondition),
      Movie.countDocuments(baseUpcomingCondition),
      Movie.countDocuments({ ...baseUpcomingCondition, releaseDate: { $gte: startOfToday, $lte: in30Days } }),
      Movie.countDocuments({ ...baseUpcomingCondition, releaseDate: { $gt: in30Days } }),
      Movie.countDocuments({ ...baseUpcomingCondition, releaseDate: { $gte: startOfToday, $lte: end2026Date }, releaseYear: 2026 }),
      Movie.countDocuments({ ...baseUpcomingCondition, releaseYear: 2027 }),
      Movie.countDocuments({ ...baseUpcomingCondition, releaseYear: { $gte: 2028 } }),
      Movie.countDocuments({ ...baseUpcomingCondition, industry: 'bollywood' }),
      Movie.countDocuments({ ...baseUpcomingCondition, industry: 'hollywood' }),
      Movie.countDocuments({ ...baseUpcomingCondition, industry: 'south_indian' }),
      Movie.countDocuments({
        ...baseUpcomingCondition,
        $or: [
          { industry: 'anime' },
          { country: { $nin: ['India', 'United States'] } },
          { languages: { $in: ['Japanese', 'Korean', 'Spanish', 'French', 'German'] } },
        ],
      }),
    ]);

    // Build categories list ONLY when matching movie data is available
    const categories = [
      { id: 'all', label: 'All Upcoming', count: totalUpcomingCount },
      ...(releasingSoonCount > 0 ? [{ id: 'releasing_soon', label: 'Releasing Soon (Next 30 Days)', count: releasingSoonCount }] : []),
      ...(upcomingLaterCount > 0 ? [{ id: 'upcoming_later', label: 'Upcoming (> 30 Days)', count: upcomingLaterCount }] : []),
      ...(count2026 > 0 ? [{ id: '2026', label: 'Upcoming in 2026', count: count2026 }] : []),
      ...(count2027 > 0 ? [{ id: '2027', label: 'Coming in 2027', count: count2027 }] : []),
      ...(count2028Plus > 0 ? [{ id: '2028_plus', label: 'Upcoming in 2028 & Beyond', count: count2028Plus }] : []),
      ...(bollywoodCount > 0 ? [{ id: 'bollywood', label: 'Bollywood Upcoming', count: bollywoodCount }] : []),
      ...(hollywoodCount > 0 ? [{ id: 'hollywood', label: 'Hollywood Upcoming', count: hollywoodCount }] : []),
      ...(southIndianCount > 0 ? [{ id: 'south_indian', label: 'South Indian Upcoming', count: southIndianCount }] : []),
      ...(internationalCount > 0 ? [{ id: 'international', label: 'International / Anime', count: internationalCount }] : []),
    ];

    const responsePayload = {
      success: true,
      total,
      count: movies.length,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      hasMore: pageNum * limitNum < total,
      categories,
      activeCategory: category || 'all',
      filters: {
        category: category || 'all',
        genre: genre || 'All',
        language: language || 'All',
        industry: selectedIndustry || 'All',
        timeframe: timeframe || 'All',
        sortBy,
      },
      availableGenres: allGenres.filter(Boolean).sort(),
      availableLanguages: allLanguages.filter(Boolean).sort(),
      movies,
    };

    serverCache.set(cacheKey, responsePayload, 60000);

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @desc Get single movie by slug or ID
// @route GET /api/v1/movies/:idOrSlug
export const getMovie = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let movie;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(idOrSlug);
    } else {
      movie = await Movie.findOne({ slug: idOrSlug });
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // If user is authenticated, check watchlist/favourites/reviewed status
    let userContext = {
      inWatchlist: false,
      inFavourites: false,
      inWatched: false,
      userReview: null,
    };

    if (req.user) {
      userContext.inWatchlist = req.user.watchlist.some(
        (id) => id.toString() === movie._id.toString()
      );
      userContext.inFavourites = req.user.favourites.some(
        (id) => id.toString() === movie._id.toString()
      );
      userContext.inWatched = req.user.watched.some(
        (id) => id.toString() === movie._id.toString()
      );

      const review = await Review.findOne({
        movie: movie._id,
        user: req.user._id,
      });
      if (review) {
        userContext.userReview = review;
      }
    }

    res.status(200).json({
      success: true,
      movie,
      userContext,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Movie Recommendations
// @route GET /api/v1/movies/:id/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    const [similarGenre, sameDirector, sameActor, trendingRecs] = await Promise.all([
      // Similar genres
      Movie.find({
        _id: { $ne: movie._id },
        genres: { $in: movie.genres },
      })
        .limit(6)
        .sort({ 'ratingSummary.imdbRating': -1 }),

      // Same director
      Movie.find({
        _id: { $ne: movie._id },
        director: movie.director,
      }).limit(6),

      // Same lead actors
      Movie.find({
        _id: { $ne: movie._id },
        'cast.name': { $in: movie.cast.slice(0, 3).map((c) => c.name) },
      }).limit(6),

      // Trending
      Movie.find({
        _id: { $ne: movie._id },
        trending: true,
      }).limit(6),
    ]);

    res.status(200).json({
      success: true,
      data: {
        similarGenre,
        sameDirector,
        sameActor,
        trendingRecs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin endpoints
export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    serverCache.clearPrefix('movie_');
    serverCache.clearPrefix('upcoming_');
    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    serverCache.clearPrefix('movie_');
    serverCache.clearPrefix('upcoming_');
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    await Review.deleteMany({ movie: req.params.id });
    serverCache.clearPrefix('movie_');
    serverCache.clearPrefix('upcoming_');
    res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Search Indian cities across all 36 States & Union Territories (4,200+ cities)
// @route GET /api/v1/movies/cities/search
export const searchIndianCities = async (req, res, next) => {
  try {
    const { q = '', limit = 15 } = req.query;
    const cities = cityService.searchCities(q, parseInt(limit, 10) || 15);
    res.status(200).json({
      success: true,
      query: q,
      totalSearchableCities: cityService.allCities.length,
      count: cities.length,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Validate whether an Indian city exists in the official registry
// @route GET /api/v1/movies/cities/validate
export const validateIndianCity = async (req, res, next) => {
  try {
    const { city = '', state = '' } = req.query;
    const result = cityService.validateCity(city, state);
    res.status(200).json({
      success: true,
      isValid: result.isValid,
      city: result.city,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get supported ticket cities and statistics
// @route GET /api/v1/movies/tickets/cities
export const getTicketCities = async (req, res, next) => {
  try {
    const popularCities = cityService.searchCities('', 16);
    const nowShowingCount = await Movie.countDocuments({ releaseStatus: 'now_showing' });

    res.status(200).json({
      success: true,
      totalSearchableCities: cityService.allCities.length,
      cities: popularCities,
      totalCinemas: popularCities.reduce((sum, c) => sum + (c.cinemasCount || 0), 0),
      nowShowingCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Search movies showing in a specific city
// @route GET /api/v1/movies/tickets/search
export const searchMoviesByCity = async (req, res, next) => {
  try {
    const { city = 'Mumbai', state = '', q = '' } = req.query;

    const validation = cityService.validateCity(city, state);
    const cityName = validation.isValid ? validation.city.name : normalizeCity(city);
    const stateName = validation.isValid ? validation.city.state : (state || 'India');
    const normalizedTarget = cityName.toLowerCase();

    const query = { releaseStatus: 'now_showing' };
    if (q && q.trim()) {
      query.title = new RegExp(escapeRegex(q.trim()), 'i');
    }

    const movies = await Movie.find(query).select(
      'title slug poster backdrop genres languages certification runtime ratingSummary cityShowtimes ticketPricing releaseStatus releaseDate releaseYear director'
    );

    const formatted = movies.map((m) => {
      // 1. Check if DB has explicit verified showtimes for this city
      const cityData = m.cityShowtimes?.find((cs) => {
        if (!cs || !cs.city) return false;
        const normCs = normalizeCity(cs.city).toLowerCase();
        return normCs === normalizedTarget || cs.city.toLowerCase() === normalizedTarget;
      });

      const theatres = cityData && cityData.theatres ? cityData.theatres : [];
      const hasShowtimes = theatres.length > 0;

      // Extract minimum starting price if verified showtimes exist (do not invent mock prices)
      let startingPrice = null;
      if (hasShowtimes && theatres[0]?.showDates?.[0]?.shows?.[0]?.seatCategories?.[0]?.price) {
        startingPrice = theatres[0].showDates[0].shows[0].seatCategories[0].price;
      }

      return {
        _id: m._id,
        title: m.title,
        slug: m.slug,
        poster: m.poster,
        backdrop: m.backdrop,
        genres: m.genres,
        languages: m.languages,
        certification: m.certification,
        runtime: m.runtime,
        releaseYear: m.releaseYear,
        releaseDate: m.releaseDate,
        director: m.director,
        ratingSummary: m.ratingSummary,
        releaseStatus: m.releaseStatus,
        isShowingInCity: hasShowtimes,
        theatreCount: theatres.length,
        theatres: theatres,
        startingPrice,
      };
    });

    res.status(200).json({
      success: true,
      city: cityName,
      state: stateName,
      count: formatted.length,
      showingCount: formatted.filter((f) => f.isShowingInCity).length,
      movies: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get City-specific showtimes for a single movie
// @route GET /api/v1/movies/:idOrSlug/showtimes
export const getMovieShowtimes = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const { city = 'Mumbai', state = '' } = req.query;

    const validation = cityService.validateCity(city, state);
    const cityName = validation.isValid ? validation.city.name : normalizeCity(city);
    const stateName = validation.isValid ? validation.city.state : (state || 'India');
    const normalizedTarget = cityName.toLowerCase();

    let movie;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(idOrSlug);
    } else {
      movie = await Movie.findOne({ slug: idOrSlug });
    }

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const citySchedule = movie.cityShowtimes?.find((cs) => {
      if (!cs || !cs.city) return false;
      const normCs = normalizeCity(cs.city).toLowerCase();
      return normCs === normalizedTarget || cs.city.toLowerCase() === normalizedTarget;
    });

    // Strictly check verified showtimes for the target city; do not invent mock showtimes
    const theatres = citySchedule && citySchedule.theatres ? citySchedule.theatres : [];

    if (!theatres || theatres.length === 0) {
      return res.status(200).json({
        success: true,
        isShowing: false,
        city: cityName,
        state: stateName,
        movie: {
          _id: movie._id,
          title: movie.title,
          slug: movie.slug,
          poster: movie.poster,
          backdrop: movie.backdrop,
          releaseStatus: movie.releaseStatus,
          releaseDate: movie.releaseDate,
          certification: movie.certification,
          runtime: movie.runtime,
          languages: movie.languages,
          genres: movie.genres,
        },
        message:
          movie.releaseStatus === 'upcoming'
            ? `Advance bookings for ${movie.title} in ${cityName} have not opened yet. Advance tickets usually go live 3 to 5 days prior to theatrical release.`
            : `Tickets for ${movie.title} are currently unavailable in ${cityName}. No active cinema showtimes are listed for this location.`,
        theatres: [],
      });
    }

    res.status(200).json({
      success: true,
      isShowing: true,
      city: cityName,
      state: stateName,
      movie: {
        _id: movie._id,
        title: movie.title,
        slug: movie.slug,
        poster: movie.poster,
        backdrop: movie.backdrop,
        releaseStatus: movie.releaseStatus,
        releaseDate: movie.releaseDate,
        certification: movie.certification,
        runtime: movie.runtime,
        languages: movie.languages,
        genres: movie.genres,
      },
      theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Universal image proxy for zero CORS/Referer issues
// @route GET /api/v1/movies/proxy-image
const proxyCache = new Map();

export const proxyImage = (req, res) => {
  const { url } = req.query;
  const fallback =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';

  if (!url) return res.redirect(fallback);

  // Return cached buffer if exists
  if (proxyCache.has(url)) {
    const cached = proxyCache.get(url);
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.end(cached.buffer);
  }

  const fetchWithRedirects = (targetUrl, redirectsLeft = 3) => {
    if (redirectsLeft <= 0) return res.redirect(fallback);

    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;

      client
        .get(
          targetUrl,
          {
            headers: {
              'User-Agent': 'ZENKAI-Media/2.0 (entertainment discovery platform; contact@zenkai.com)',
              Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
          },
          (proxyRes) => {
            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
              const redirectUrl = new URL(proxyRes.headers.location, targetUrl).toString();
              return fetchWithRedirects(redirectUrl, redirectsLeft - 1);
            }

            if (proxyRes.statusCode >= 400) {
              return res.redirect(fallback);
            }

            const contentType = proxyRes.headers['content-type'] || 'image/jpeg';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

            const chunks = [];
            proxyRes.on('data', (c) => chunks.push(c));
            proxyRes.on('end', () => {
              const buffer = Buffer.concat(chunks);
              if (buffer.length > 0 && buffer.length < 5 * 1024 * 1024) {
                proxyCache.set(url, { contentType, buffer });
                if (proxyCache.size > 200) {
                  const firstKey = proxyCache.keys().next().value;
                  proxyCache.delete(firstKey);
                }
              }
              res.end(buffer);
            });
          }
        )
        .on('error', () => {
          res.redirect(fallback);
        });
    } catch {
      res.redirect(fallback);
    }
  };

  fetchWithRedirects(url);
};

// @desc Synchronize and select best official posters from TMDB & verified registry
// @route POST /api/v1/movies/sync-media
export const syncMovies = async (req, res, next) => {
  try {
    const result = await syncMoviePosters(req.body || {});
    res.status(200).json({
      success: true,
      message: 'Movie posters synchronized successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
