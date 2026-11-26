import Movie from '../models/Movie.js';
import MusicEvent from '../models/MusicEvent.js';
import Artist from '../models/Artist.js';

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// @desc Unified Search across Movies, Music Events, and Artists
// @route GET /api/v1/search/unified
export const unifiedSearch = async (req, res, next) => {
  try {
    const {
      q = '',
      type = 'all', // 'all', 'movies', 'music', 'artists'
      status = 'all',
      city = 'all',
      genre = 'all',
      language = 'all',
      minPrice,
      maxPrice,
      limit = 20,
    } = req.query;

    const results = {
      movies: [],
      events: [],
      artists: [],
      totalMovies: 0,
      totalEvents: 0,
      totalArtists: 0,
    };

    const hasQuery = q && q.trim().length > 0;
    const regex = hasQuery ? new RegExp(escapeRegex(q.trim()), 'i') : null;

    // 1. Search Movies if type is 'all' or 'movies'
    if (type.toLowerCase() === 'all' || type.toLowerCase() === 'movies') {
      const movieAndClauses = [];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const in30Days = new Date(startOfToday.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Theatrical status filter: strictly now showing in cinemas OR upcoming from startOfToday onward
      const st = status ? status.toLowerCase() : 'all';
      if (st === 'upcoming') {
        movieAndClauses.push({ releaseStatus: 'upcoming', releaseDate: { $gt: in30Days } });
      } else if (st === 'releasing_soon' || st === 'soon') {
        movieAndClauses.push({ releaseStatus: 'upcoming', releaseDate: { $gte: startOfToday, $lte: in30Days } });
      } else if (st === 'now_showing' || st === 'available' || st === 'showing') {
        movieAndClauses.push({ releaseStatus: 'now_showing' });
      } else if (st === 'coming_2027') {
        movieAndClauses.push({ releaseStatus: 'upcoming', releaseYear: 2027, releaseDate: { $gte: startOfToday } });
      } else {
        // Base active theatrical: strictly now_showing OR upcoming from startOfToday onward
        movieAndClauses.push({
          $or: [
            { releaseStatus: 'now_showing' },
            { releaseStatus: 'upcoming', releaseDate: { $gte: startOfToday } },
          ],
        });
      }

      if (regex) {
        movieAndClauses.push({
          $or: [
            { title: regex },
            { director: regex },
            { 'cast.name': regex },
            { genres: regex },
            { languages: regex },
          ],
        });
      }

      if (genre && genre.toLowerCase() !== 'all') {
        movieAndClauses.push({ genres: { $in: [new RegExp(`^${escapeRegex(genre)}$`, 'i')] } });
      }

      if (language && language.toLowerCase() !== 'all') {
        movieAndClauses.push({ languages: { $in: [new RegExp(`^${escapeRegex(language)}$`, 'i')] } });
      }

      if (minPrice || maxPrice) {
        const priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice);
        if (maxPrice) priceFilter.$lte = Number(maxPrice);
        movieAndClauses.push({ 'ticketPricing.price': priceFilter });
      }

      const movieFilter = { $and: movieAndClauses };

      const [movieList, movieCount] = await Promise.all([
        Movie.find(movieFilter)
          .sort({ 'ratingSummary.averageAudienceRating': -1, releaseDate: 1 })
          .limit(parseInt(limit, 10)),
        Movie.countDocuments(movieFilter),
      ]);

      results.movies = movieList;
      results.totalMovies = movieCount;
    }

    // 2. Search Music Events if type is 'all' or 'music'
    if (type.toLowerCase() === 'all' || type.toLowerCase() === 'music') {
      const eventFilter = {};
      if (regex) {
        eventFilter.$or = [
          { title: regex },
          { artistName: regex },
          { 'performingArtists.name': regex },
          { 'venue.name': regex },
          { 'venue.city': regex },
          { genres: regex },
          { eventType: regex },
        ];
      }

      if (city && city.toLowerCase() !== 'all') {
        eventFilter['venue.city'] = new RegExp(`^${escapeRegex(city)}$`, 'i');
      }

      if (genre && genre.toLowerCase() !== 'all') {
        eventFilter.genres = { $in: [new RegExp(`^${escapeRegex(genre)}$`, 'i')] };
      }

      if (status && status.toLowerCase() === 'upcoming') {
        eventFilter.status = 'upcoming';
      } else if (status && status.toLowerCase() === 'available') {
        eventFilter.status = { $in: ['upcoming', 'live'] };
      }

      if (minPrice || maxPrice) {
        eventFilter['ticketPricing.price'] = {};
        if (minPrice) eventFilter['ticketPricing.price'].$gte = Number(minPrice);
        if (maxPrice) eventFilter['ticketPricing.price'].$lte = Number(maxPrice);
      }

      const [eventList, eventCount] = await Promise.all([
        MusicEvent.find(eventFilter)
          .populate('artist', 'name image slug')
          .sort({ eventDate: 1 })
          .limit(parseInt(limit, 10)),
        MusicEvent.countDocuments(eventFilter),
      ]);

      results.events = eventList;
      results.totalEvents = eventCount;
    }

    // 3. Search Artists if query matches or type is 'artists'
    if (type.toLowerCase() === 'all' || type.toLowerCase() === 'artists') {
      const artistFilter = {};
      if (regex) {
        artistFilter.$or = [{ name: regex }, { genres: regex }, { bio: regex }];
      }
      if (genre && genre.toLowerCase() !== 'all') {
        artistFilter.genres = { $in: [new RegExp(`^${escapeRegex(genre)}$`, 'i')] };
      }

      const [artistList, artistCount] = await Promise.all([
        Artist.find(artistFilter).limit(8),
        Artist.countDocuments(artistFilter),
      ]);

      results.artists = artistList;
      results.totalArtists = artistCount;
    }

    res.status(200).json({
      success: true,
      query: q,
      type,
      data: results,
      totalOverall: results.totalMovies + results.totalEvents + results.totalArtists,
    });
  } catch (error) {
    next(error);
  }
};
