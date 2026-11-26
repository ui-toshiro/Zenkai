import MusicEvent from '../models/MusicEvent.js';
import Artist from '../models/Artist.js';
import { serverCache } from '../utils/cache.js';

// Helper to escape regex
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// @desc Get Music Discovery Sections for Music Hub & Homepage
// @route GET /api/v1/music/discovery
export const getMusicDiscovery = async (req, res, next) => {
  try {
    const cacheKey = 'music_discovery_sections_v2';
    const cachedData = serverCache.get(cacheKey);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    if (cachedData) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedData,
      });
    }

    // Dynamic current date calculations - no hardcoded years!
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const happeningSoonEnd = new Date(startOfToday.getTime() + 14 * 24 * 60 * 60 * 1000);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);

    const baseFilter = {
      eventDate: { $gte: startOfToday },
      status: { $nin: ['past', 'cancelled'] },
    };

    const [
      upcomingConcerts,
      happeningSoon,
      thisMonth,
      nextMonth,
      upcomingMusicFestivals,
      liveMusicEvents,
      internationalConcerts,
      indianMusicEvents,
      recentlyAnnounced,
      featuredArtists,
    ] = await Promise.all([
      // 1. Upcoming Concerts (All future verified concerts)
      MusicEvent.find(baseFilter)
        .populate('artist', 'name image slug genres monthlyListeners')
        .sort({ eventDate: 1 })
        .lean()
        .limit(12),

      // 2. Happening Soon (Next 14 Days)
      MusicEvent.find({
        ...baseFilter,
        eventDate: { $gte: startOfToday, $lte: happeningSoonEnd },
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 3. This Month (Current Calendar Month)
      MusicEvent.find({
        ...baseFilter,
        eventDate: { $gte: startOfToday, $lte: endOfThisMonth },
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 4. Next Month (Upcoming Calendar Month)
      MusicEvent.find({
        ...baseFilter,
        eventDate: { $gte: startOfNextMonth, $lte: endOfNextMonth },
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 5. Upcoming Music Festivals
      MusicEvent.find({
        ...baseFilter,
        $or: [{ eventType: 'festival' }, { isFestival: true }],
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 6. Live Music Events & Gigs
      MusicEvent.find({
        ...baseFilter,
        $or: [{ eventType: 'live_gig' }, { eventType: 'concert' }, { status: 'live' }],
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 7. International Concerts
      MusicEvent.find({
        ...baseFilter,
        $or: [{ isInternational: true }, { 'venue.country': { $ne: 'India' } }],
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 8. Indian Music Events
      MusicEvent.find({
        ...baseFilter,
        'venue.country': 'India',
      })
        .populate('artist', 'name image slug genres')
        .sort({ eventDate: 1 })
        .lean()
        .limit(8),

      // 9. Recently Announced Concerts
      MusicEvent.find({
        ...baseFilter,
        isRecentlyAnnounced: true,
      })
        .populate('artist', 'name image slug genres')
        .sort({ createdAt: -1, eventDate: 1 })
        .lean()
        .limit(8),

      // 10. Featured Artists for showcase
      Artist.find({ isFeatured: true }).lean().limit(8),
    ]);

    const resultData = {
      currentDate: now.toISOString(),
      upcomingConcerts,
      happeningSoon,
      thisMonth,
      nextMonth,
      upcomingMusicFestivals,
      liveMusicEvents,
      internationalConcerts,
      indianMusicEvents,
      recentlyAnnounced,
      featuredArtists,
    };

    serverCache.set(cacheKey, resultData, 60000);

    res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Search & Filter Music Events
// @route GET /api/v1/music/events
export const getAllMusicEvents = async (req, res, next) => {
  try {
    const {
      q,
      category,
      genre,
      city,
      eventType,
      status,
      artist,
      minPrice,
      maxPrice,
      sortBy = 'date_asc',
      page = 1,
      limit = 16,
    } = req.query;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const happeningSoonEnd = new Date(startOfToday.getTime() + 14 * 24 * 60 * 60 * 1000);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);

    // By default strictly filter for today onward and exclude completed/cancelled
    const queryFilter = {
      eventDate: { $gte: startOfToday },
      status: { $nin: ['past', 'cancelled'] },
    };

    // Category-specific presets
    if (category) {
      const cat = category.toLowerCase();
      if (cat === 'happening_soon') {
        queryFilter.eventDate = { $gte: startOfToday, $lte: happeningSoonEnd };
      } else if (cat === 'this_month') {
        queryFilter.eventDate = { $gte: startOfToday, $lte: endOfThisMonth };
      } else if (cat === 'next_month') {
        queryFilter.eventDate = { $gte: startOfNextMonth, $lte: endOfNextMonth };
      } else if (cat === 'festivals') {
        queryFilter.$or = [{ eventType: 'festival' }, { isFestival: true }];
      } else if (cat === 'live_gigs') {
        queryFilter.$or = [{ eventType: 'live_gig' }, { eventType: 'concert' }, { status: 'live' }];
      } else if (cat === 'international') {
        queryFilter.$or = [{ isInternational: true }, { 'venue.country': { $ne: 'India' } }];
      } else if (cat === 'indian') {
        queryFilter['venue.country'] = 'India';
      } else if (cat === 'recently_announced') {
        queryFilter.isRecentlyAnnounced = true;
      }
    }

    if (q && q.trim()) {
      const regex = new RegExp(escapeRegex(q.trim()), 'i');
      queryFilter.$or = [
        { title: regex },
        { artistName: regex },
        { description: regex },
        { 'venue.name': regex },
        { 'venue.city': regex },
        { genres: regex },
      ];
    }

    if (genre && genre.toLowerCase() !== 'all') {
      queryFilter.genres = { $in: [new RegExp(`^${escapeRegex(genre)}$`, 'i')] };
    }

    if (city && city.toLowerCase() !== 'all') {
      queryFilter['venue.city'] = new RegExp(`^${escapeRegex(city)}$`, 'i');
    }

    if (eventType && eventType.toLowerCase() !== 'all') {
      queryFilter.eventType = eventType;
    }

    if (status && status.toLowerCase() !== 'all') {
      queryFilter.status = status;
    }

    if (artist) {
      queryFilter.$or = [
        { artistName: new RegExp(escapeRegex(artist), 'i') },
        { 'performingArtists.name': new RegExp(escapeRegex(artist), 'i') },
      ];
    }

    if (minPrice || maxPrice) {
      queryFilter['ticketPricing.price'] = {};
      if (minPrice) queryFilter['ticketPricing.price'].$gte = Number(minPrice);
      if (maxPrice) queryFilter['ticketPricing.price'].$lte = Number(maxPrice);
    }

    let sort = { eventDate: 1 };
    if (sortBy === 'date_desc') sort = { eventDate: -1 };
    if (sortBy === 'price_asc') sort = { 'ticketPricing.0.price': 1 };
    if (sortBy === 'price_desc') sort = { 'ticketPricing.0.price': -1 };
    if (sortBy === 'popular') sort = { isPopular: -1, likesCount: -1 };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await MusicEvent.countDocuments(queryFilter);
    const events = await MusicEvent.find(queryFilter)
      .populate('artist', 'name image slug genres')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Single Music Event Details
// @route GET /api/v1/music/events/:idOrSlug
export const getMusicEvent = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let event;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      event = await MusicEvent.findById(idOrSlug).populate('artist').populate('performingArtists.artistRef');
    } else {
      event = await MusicEvent.findOne({ slug: idOrSlug }).populate('artist').populate('performingArtists.artistRef');
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Music event not found',
      });
    }

    let userContext = {
      isSaved: false,
      hasReminder: false,
    };

    if (req.user) {
      userContext.isSaved = req.user.savedEvents?.some(
        (id) => id.toString() === event._id.toString()
      );
      userContext.hasReminder = req.user.eventReminders?.some(
        (r) => r.event?.toString() === event._id.toString()
      );
    }

    // Related events by same artist or same city
    const relatedEvents = await MusicEvent.find({
      _id: { $ne: event._id },
      $or: [
        { artistName: event.artistName },
        { 'venue.city': event.venue?.city },
        { genres: { $in: event.genres } },
      ],
      eventDate: { $gte: new Date() },
    })
      .limit(4)
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      event,
      userContext,
      relatedEvents,
    });
  } catch (error) {
    next(error);
  }
};

export const createMusicEvent = async (req, res, next) => {
  try {
    const event = await MusicEvent.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const updateMusicEvent = async (req, res, next) => {
  try {
    const event = await MusicEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const deleteMusicEvent = async (req, res, next) => {
  try {
    const event = await MusicEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
