import User from '../models/User.js';
import Movie from '../models/Movie.js';
import MusicEvent from '../models/MusicEvent.js';
import Artist from '../models/Artist.js';
import Review from '../models/Review.js';

// @desc Get user watchlist
// @route GET /api/v1/users/watchlist
export const getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'watchlist',
      select: 'title poster releaseYear ratingSummary slug genres industry releaseStatus ticketPricing',
    });
    res.status(200).json({ success: true, watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle movie in watchlist
// @route POST /api/v1/users/watchlist/:movieId
export const toggleWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.watchlist.findIndex((id) => id.toString() === movieId);
    let inWatchlist = false;

    if (index > -1) {
      user.watchlist.splice(index, 1);
      inWatchlist = false;
    } else {
      user.watchlist.push(movieId);
      inWatchlist = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      inWatchlist,
      message: inWatchlist ? 'Added to Watchlist' : 'Removed from Watchlist',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle movie in favourites
// @route POST /api/v1/users/favourites/:movieId
export const toggleFavourites = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.favourites.findIndex((id) => id.toString() === movieId);
    let inFavourites = false;

    if (index > -1) {
      user.favourites.splice(index, 1);
      inFavourites = false;
    } else {
      user.favourites.push(movieId);
      inFavourites = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      inFavourites,
      message: inFavourites ? 'Added to Favourites' : 'Removed from Favourites',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle movie in watched list
// @route POST /api/v1/users/watched/:movieId
export const toggleWatched = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.watched.findIndex((id) => id.toString() === movieId);
    let inWatched = false;

    if (index > -1) {
      user.watched.splice(index, 1);
      inWatched = false;
    } else {
      user.watched.push(movieId);
      inWatched = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      inWatched,
      message: inWatched ? 'Marked as Watched' : 'Removed from Watched',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle saved music event
// @route POST /api/v1/users/saved-events/:eventId
export const toggleSavedEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.savedEvents.findIndex((id) => id.toString() === eventId);
    let isSaved = false;

    if (index > -1) {
      user.savedEvents.splice(index, 1);
      isSaved = false;
    } else {
      user.savedEvents.push(eventId);
      isSaved = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      isSaved,
      message: isSaved ? 'Event saved to your collection' : 'Event removed from saved list',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle event reminder
// @route POST /api/v1/users/event-reminders/:eventId
export const toggleEventReminder = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.eventReminders.findIndex(
      (r) => r.event?.toString() === eventId
    );
    let hasReminder = false;

    if (index > -1) {
      user.eventReminders.splice(index, 1);
      hasReminder = false;
    } else {
      user.eventReminders.push({ event: eventId, reminderSetAt: new Date(), emailNotification: true });
      hasReminder = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      hasReminder,
      message: hasReminder ? 'Reminder set! We will notify you before the concert' : 'Event reminder cancelled',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle favourite artist
// @route POST /api/v1/users/favourite-artists/:artistId
export const toggleFavouriteArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.favouriteArtists.findIndex(
      (id) => id.toString() === artistId
    );
    let isFavourite = false;

    if (index > -1) {
      user.favouriteArtists.splice(index, 1);
      isFavourite = false;
    } else {
      user.favouriteArtists.push(artistId);
      isFavourite = true;
    }

    await user.save();
    res.status(200).json({
      success: true,
      isFavourite,
      message: isFavourite ? 'Added to Favourite Artists' : 'Removed from Favourite Artists',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Record recently viewed movie or music event
// @route POST /api/v1/users/recently-viewed
export const recordRecentlyViewed = async (req, res, next) => {
  try {
    const { itemType = 'movie', itemId } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: 'itemId required' });

    const user = await User.findById(req.user._id);

    // Remove existing if duplicate
    user.recentlyViewed = user.recentlyViewed.filter((rv) => {
      if (itemType === 'movie' && rv.movie) return rv.movie.toString() !== itemId;
      if (itemType === 'music_event' && rv.event) return rv.event.toString() !== itemId;
      return true;
    });

    const newEntry = {
      itemType,
      viewedAt: new Date(),
    };
    if (itemType === 'movie') newEntry.movie = itemId;
    else newEntry.event = itemId;

    user.recentlyViewed.unshift(newEntry);
    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }

    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc Get complete profile data
// @route GET /api/v1/users/profile-data
export const getUserProfileData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist', 'title poster releaseYear ratingSummary slug genres industry')
      .populate('favourites', 'title poster releaseYear ratingSummary slug genres industry')
      .populate('watched', 'title poster releaseYear ratingSummary slug genres industry')
      .populate('favouriteArtists', 'name image slug genres monthlyListeners')
      .populate({
        path: 'savedEvents',
        select: 'title poster eventDate venue ticketPricing slug eventType artistName',
      })
      .populate({
        path: 'eventReminders.event',
        select: 'title poster eventDate venue ticketPricing slug eventType artistName',
      })
      .populate({
        path: 'recentlyViewed.movie',
        select: 'title poster releaseYear slug ratingSummary',
      })
      .populate({
        path: 'recentlyViewed.event',
        select: 'title poster eventDate venue slug eventType artistName',
      });

    const reviews = await Review.find({ user: req.user._id })
      .populate('movie', 'title poster slug releaseYear ratingSummary')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      reviews,
      stats: {
        watchlistCount: user.watchlist.length,
        favouritesCount: user.favourites.length,
        watchedCount: user.watched.length,
        favouriteArtistsCount: user.favouriteArtists.length,
        savedEventsCount: user.savedEvents.length,
        remindersCount: user.eventReminders.length,
        reviewsCount: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
