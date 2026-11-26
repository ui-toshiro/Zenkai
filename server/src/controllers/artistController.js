import Artist from '../models/Artist.js';
import MusicEvent from '../models/MusicEvent.js';
import { syncArtistPictures } from '../services/mediaSyncService.js';
import https from 'https';
import http from 'http';

// Helper to escape regex
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// In-memory artist image proxy cache
const artistProxyCache = new Map();

// @desc Proxy artist photographs to prevent CORS, 429 rate-limiting and hotlink blocks
// @route GET /api/v1/artists/proxy-image
export const proxyArtistImage = (req, res) => {
  const { url } = req.query;
  const fallback = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';

  if (!url) return res.redirect(fallback);

  if (artistProxyCache.has(url)) {
    const cached = artistProxyCache.get(url);
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
              'User-Agent': 'ZENKAI-Media/2.0 (music artist directory; contact@zenkai.com)',
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
                artistProxyCache.set(url, { contentType, buffer });
                if (artistProxyCache.size > 200) {
                  const firstKey = artistProxyCache.keys().next().value;
                  artistProxyCache.delete(firstKey);
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

// @desc Synchronize artist profile pictures dynamically from TMDB & verified sources
// @route POST /api/v1/artists/sync-media
export const syncArtists = async (req, res, next) => {
  try {
    const result = await syncArtistPictures();
    res.status(200).json({
      success: true,
      message: 'Artist pictures synchronized successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all artists (with optional search, genre and category filter)
// @route GET /api/v1/artists
export const getAllArtists = async (req, res, next) => {
  try {
    const { q, genre, category, limit = 50 } = req.query;
    const filter = {};

    if (q && q.trim()) {
      filter.name = new RegExp(escapeRegex(q.trim()), 'i');
    }
    if (genre && genre !== 'All') {
      filter.genres = { $in: [genre] };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const artists = await Artist.find(filter)
      .sort({ isFeatured: -1, isPopular: -1, name: 1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single artist profile by slug or ID with upcoming tours & tracks
// @route GET /api/v1/artists/:idOrSlug
export const getArtist = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let artist;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      artist = await Artist.findById(idOrSlug);
    } else {
      artist = await Artist.findOne({ slug: idOrSlug });
    }

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }

    // Fetch artist's upcoming concerts & tours (strictly future dates >= today)
    const now = new Date();
    const upcomingEvents = await MusicEvent.find({
      $or: [
        { artist: artist._id },
        { artistName: artist.name },
        { 'performingArtists.name': artist.name },
      ],
      eventDate: { $gte: now },
      status: { $nin: ['past', 'cancelled'] },
    }).sort({ eventDate: 1 });

    // Fetch related artists if not predefined
    let relatedArtists = artist.relatedArtists || [];
    if (relatedArtists.length === 0) {
      const relatedDocs = await Artist.find({
        _id: { $ne: artist._id },
        $or: [
          { category: artist.category },
          { genres: { $in: artist.genres } },
        ],
      })
        .select('name slug image genres monthlyListeners country')
        .limit(4)
        .lean();
      relatedArtists = relatedDocs;
    }

    // Check if current user has favourited this artist
    let isFavourite = false;
    if (req.user) {
      isFavourite = req.user.favouriteArtists?.some(
        (id) => id.toString() === artist._id.toString()
      );
    }

    res.status(200).json({
      success: true,
      artist,
      upcomingEvents,
      relatedArtists,
      isFavourite,
    });
  } catch (error) {
    next(error);
  }
};

// Admin create / edit
export const createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }
    res.status(200).json({ success: true, artist });
  } catch (error) {
    next(error);
  }
};
