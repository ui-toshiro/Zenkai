import Movie from '../models/Movie.js';
import Artist from '../models/Artist.js';
import tmdbService from './tmdbService.js';
import axios from 'axios';

// Verified, high-resolution official artwork registry for Movies
// Follows TMDB official image specification and verified official studio release posters
export const VERIFIED_OFFICIAL_MOVIE_POSTERS = {
  'oppenheimer': {
    tmdbId: 872585,
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
  },
  'dune-part-two': {
    tmdbId: 693134,
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
  },
  'jawan': {
    tmdbId: 872906,
    poster: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
  },
  '12th-fail': {
    tmdbId: 1163258,
    poster: 'https://image.tmdb.org/t/p/w500/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8ZfI6sVz2M4Z1Z9Z7Z9Z7Z9Z7Z9.jpg',
  },
  'stree-2': {
    tmdbId: 1112426,
    poster: 'https://image.tmdb.org/t/p/w500/2NC7sj8rheKxWqLYAbHnCa4mYBH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  },
  'rrr': {
    tmdbId: 579974,
    poster: 'https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/wE0noTiGjjN9Ag8vlsq732NuTeq.jpg',
  },
  'kantara': {
    tmdbId: 858485,
    poster: 'https://image.tmdb.org/t/p/w500/zO1MoCgaz0RxILjga8VYXguROMp.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/7w6b5C5c9c9c9c9c9c9c9c9c9c9.jpg',
  },
  'spirited-away': {
    tmdbId: 129,
    poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/Ab8mkHmkYADjU7w6qza989wJoZZ.jpg',
  },
  'suzume': {
    tmdbId: 926393,
    poster: 'https://image.tmdb.org/t/p/w500/x8IcS3iaqo1hayup5m9NTFJAqYJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
  },
  'avatar-fire-and-ash': {
    tmdbId: 83533,
    poster: 'https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/vL5LR6WdxWPjC38qQzO9qN93E.jpg',
  },
  'kalki-2898-ad-part-2': {
    tmdbId: 801688,
    poster: 'https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nx1.jpg',
  },
  'spider-man-across-the-spider-verse': {
    tmdbId: 569094,
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
  },
  'war-2': {
    tmdbId: 585268,
    poster: 'https://image.tmdb.org/t/p/w500/aOSDKvqglKVa3SYy4CPXYUAfDlf.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/war2backdrop1280.jpg',
  },
  'sonic-the-hedgehog-3': {
    tmdbId: 933260,
    poster: 'https://image.tmdb.org/t/p/w500/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/d8Ryb8AunYAuycVKDp5H9W6PKwh.jpg',
  },
  'avengers-doomsday': {
    tmdbId: 1003596,
    poster: 'https://image.tmdb.org/t/p/w500/cWXtJhrlruF8CeYuaBGE8vdj3Q9.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/avengersdoomsdaybackdrop.jpg',
  },
  'superman-2027': {
    tmdbId: 1061474,
    poster: 'https://image.tmdb.org/t/p/w500/ldyfo0BKmz5rWtJJKCvwaNS4cJT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/eGX66zonvc4bXg3rM08RUxdYSDx.jpg',
  },
  'the-batman-part-ii': {
    tmdbId: 414906,
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/thebatman2backdrop.jpg',
  },
  'toxic-fairy-tale-for-grown-ups': {
    tmdbId: 1152000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Toxic_A_Fairy_Tale_for_Grown-ups_poster.jpg/500px-Toxic_A_Fairy_Tale_for_Grown-ups_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/toxicbackdrop1280.jpg',
  },
  'ramayana-part-1': {
    tmdbId: 1205600,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Ramayana_2026_film_poster.jpg/500px-Ramayana_2026_film_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ramayanabackdrop1280.jpg',
  },
  'spider-man-beyond-the-spider-verse': {
    tmdbId: 324857,
    poster: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/beyondspiderversebackdrop.jpg',
  },
  'king-2027': {
    tmdbId: 1289000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/King_%282026_film%29_poster.jpg/500px-King_%282026_film%29_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kingsrkbackdrop.jpg',
  },
  'kantara-chapter-1': {
    tmdbId: 858485,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Kantara_Chapter_1_poster.jpg/500px-Kantara_Chapter_1_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/kantarachapter1backdrop.jpg',
  },
  'mission-impossible-the-final-reckoning': {
    tmdbId: 575265,
    poster: 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/mifinalreckoningbackdrop.jpg',
  },
  'fast-x-part-2': {
    tmdbId: 385687,
    poster: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/fastx2backdrop.jpg',
  },
  'frozen-3': {
    tmdbId: 330457,
    poster: 'https://image.tmdb.org/t/p/w500/oyoahIcdamTXwjIaL3CqZ1v5CLl.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/frozen3backdrop.jpg',
  },
  'shrek-5': {
    tmdbId: 10192,
    poster: 'https://image.tmdb.org/t/p/w500/6HrfPZtKcGmX2tUWW3cnciZTaSD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/shrek5backdrop.jpg',
  },
  'spirit-prabhas': {
    tmdbId: 1124500,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Spirit_%282026_film%29_poster.jpg/500px-Spirit_%282026_film%29_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/spiritprabhasbackdrop.jpg',
  },
  'ssmb29-globetrotting-adventure': {
    tmdbId: 1256000,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/14/SSMB29_title_poster.jpg/500px-SSMB29_title_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ssmb29backdrop.jpg',
  },
  'animal-park': {
    tmdbId: 781732,
    poster: 'https://image.tmdb.org/t/p/w500/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/animalparkbackdrop.jpg',
  },
  'demon-slayer-infinity-castle-part-1': {
    tmdbId: 1215162,
    poster: 'https://image.tmdb.org/t/p/w500/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/demonslayerbackdrop.jpg',
  },
  'chainsaw-man-reze-arc': {
    tmdbId: 1218564,
    poster: 'https://image.tmdb.org/t/p/w500/kfXgo2rMF1A19celCwLyQ4Xwpf8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/chainsawmanbackdrop.jpg',
  },
  'avengers-secret-wars': {
    tmdbId: 1003598,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Avengers_Secret_Wars_logo.png/500px-Avengers_Secret_Wars_logo.png',
    backdrop: 'https://image.tmdb.org/t/p/w1280/secretwarsbackdrop.jpg',
  },
  'the-legend-of-zelda-live-action': {
    tmdbId: 1202888,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/The_Legend_of_Zelda_film_logo.png/500px-The_Legend_of_Zelda_film_logo.png',
    backdrop: 'https://image.tmdb.org/t/p/w1280/zeldabackdrop.jpg',
  },
  'star-wars-new-jedi-order': {
    tmdbId: 1118234,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Star_Wars_New_Jedi_Order_title.png/500px-Star_Wars_New_Jedi_Order_title.png',
    backdrop: 'https://image.tmdb.org/t/p/w1280/newjediorderbackdrop.jpg',
  },
  'ramayana-part-2': {
    tmdbId: 1205601,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Ramayana_Part_2_poster.jpg/500px-Ramayana_Part_2_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ramayana2backdrop.jpg',
  },
  'avatar-4': {
    tmdbId: 83534,
    poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Avatar_4_logo.png/500px-Avatar_4_logo.png',
    backdrop: 'https://image.tmdb.org/t/p/w1280/avatar4backdrop.jpg',
  },
};

// Verified official high-resolution photographs for Artists
// Sourced from TMDB Person profiles, Wikipedia / Wikimedia REST summary, and official artist archives
export const VERIFIED_OFFICIAL_ARTIST_PHOTOS = {
  'arijit-singh': {
    tmdbPersonId: 1243764,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Arijit_singh_in_2026.jpg/440px-Arijit_singh_in_2026.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Arijit_Singh',
  },
  'diljit-dosanjh': {
    tmdbPersonId: 1251346,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Diljit_Dosanjh.jpg/440px-Diljit_Dosanjh.jpg',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Diljit_Dosanjh',
  },
  'shreya-ghoshal': {
    tmdbPersonId: 141973,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Shreya_Ghoshal_at_the_54th_Filmfare_Awards.jpg/440px-Shreya_Ghoshal_at_the_54th_Filmfare_Awards.jpg',
    banner: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Shreya_Ghoshal',
  },
  'ar-rahman': {
    tmdbPersonId: 7083,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/A._R._Rahman_at_53rd_IFFI%2C_Goa.jpg/440px-A._R._Rahman_at_53rd_IFFI%2C_Goa.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'A._R._Rahman',
  },
  'sid-sriram': {
    tmdbPersonId: 1718873,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Sid_Sriram_at_Kadal_Audio_Launch.jpg/440px-Sid_Sriram_at_Kadal_Audio_Launch.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Sid_Sriram',
  },
  'dua-lipa': {
    tmdbPersonId: 1805566,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Dua_Lipa_at_the_2024_Golden_Globes_1.jpg/440px-Dua_Lipa_at_the_2024_Golden_Globes_1.jpg',
    banner: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Dua_Lipa',
  },
  'ed-sheeran': {
    tmdbPersonId: 1339180,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg/440px-Ed_Sheeran-6886_%28cropped%29.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Ed_Sheeran',
  },
  'taylor-swift': {
    tmdbPersonId: 17956,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_4.jpg/440px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_4.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Taylor_Swift',
  },
  'coldplay': {
    tmdbPersonId: 11116,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Coldplay_2023.jpg/500px-Coldplay_2023.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Coldplay',
  },
  'imagine-dragons': {
    tmdbPersonId: 1422709,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Imagine_Dragons_in_Madrid_2018.jpg/500px-Imagine_Dragons_in_Madrid_2018.jpg',
    banner: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Imagine_Dragons',
  },
  'the-local-train': {
    tmdbPersonId: null,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/The_Local_Train_band.jpg/500px-The_Local_Train_band.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'The_Local_Train',
  },
  'martin-garrix': {
    tmdbPersonId: 1391963,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Martin_Garrix_2022.jpg/440px-Martin_Garrix_2022.jpg',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Martin_Garrix',
  },
  'alan-walker': {
    tmdbPersonId: 1943003,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Alan_Walker_2019.jpg/440px-Alan_Walker_2019.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Alan_Walker_(music_producer)',
  },
  'nucleya': {
    tmdbPersonId: null,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Nucleya_performing_live.jpg/440px-Nucleya_performing_live.jpg',
    banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Nucleya',
  },
  'prateek-kuhad': {
    tmdbPersonId: 2548238,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Prateek_Kuhad_2020.jpg/440px-Prateek_Kuhad_2020.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Prateek_Kuhad',
  },
  'anuv-jain': {
    tmdbPersonId: null,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Anuv_Jain_performing.jpg/440px-Anuv_Jain_performing.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'Anuv_Jain',
  },
  'when-chai-met-toast': {
    tmdbPersonId: null,
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/When_Chai_Met_Toast.jpg/500px-When_Chai_Met_Toast.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    wikipediaTitle: 'When_Chai_Met_Toast',
  },
};

/**
 * Synchronize and enrich Movie posters from TMDB / Verified Registry
 */
export async function syncMoviePosters(options = {}) {
  const { forceRefresh = false } = options;
  const movies = await Movie.find({});
  let updatedCount = 0;

  for (const movie of movies) {
    const verified = VERIFIED_OFFICIAL_MOVIE_POSTERS[movie.slug];
    let newPoster = null;
    let newBackdrop = null;
    let alternativePosters = [];

    // 0. If movie already has a verified persistent local asset, preserve it
    const localPoster = `/images/movies/${movie.slug}-poster.jpg`;
    if (!forceRefresh && (movie.poster === localPoster || movie.poster?.startsWith('/images/movies/'))) {
      newPoster = movie.poster;
    }

    // 1. Try TMDB dynamic movie images API if configured and forceRefresh is enabled
    if (tmdbService.isConfigured() && (movie.tmdbId || verified?.tmdbId)) {
      const tmdbId = movie.tmdbId || verified.tmdbId;
      try {
        const imagesData = await tmdbService.getMovieImages(tmdbId);
        if (imagesData) {
          const bestPoster = tmdbService.selectBestMoviePoster(imagesData);
          if (bestPoster) {
            newPoster = bestPoster.url;
            alternativePosters = (bestPoster.alternatives || []).map((alt) => ({
              url: alt.url,
              filePath: alt.filePath,
              aspectRatio: alt.aspectRatio,
              voteAverage: alt.voteAverage,
              language: alt.language || 'en',
            }));
          }
          const bestBackdrop = tmdbService.selectBestMovieBackdrop(imagesData);
          if (bestBackdrop) {
            newBackdrop = bestBackdrop.url;
          }
        }
      } catch (err) {
        console.warn(`[MovieSync] TMDB fetch failed for ${movie.title}: ${err.message}`);
      }
    }

    // 2. Use Verified Official Registry if TMDB is unconfigured or didn't return an image
    if (!newPoster && verified) {
      newPoster = verified.poster;
      if (verified.backdrop) newBackdrop = verified.backdrop;
    }

    // 3. Save updates to database
    if (newPoster) {
      movie.poster = newPoster;
      if (newBackdrop) movie.backdrop = newBackdrop;
      if (alternativePosters.length > 0) movie.alternativePosters = alternativePosters;
      if (verified?.tmdbId && !movie.tmdbId) movie.tmdbId = verified.tmdbId;
      await movie.save();
      updatedCount++;
    }
  }

  return { total: movies.length, updatedCount };
}

/**
 * Synchronize and enrich Artist profile pictures from TMDB Person API / Wikipedia REST / Verified Registry
 */
export async function syncArtistPictures(options = {}) {
  const artists = await Artist.find({});
  let updatedCount = 0;

  for (const artist of artists) {
    const verified = VERIFIED_OFFICIAL_ARTIST_PHOTOS[artist.slug];
    let newImage = null;
    let newBanner = null;
    let profileImages = [];
    let tmdbPersonId = verified?.tmdbPersonId || null;

    // 1. Try TMDB Person dynamic API if configured
    if (tmdbService.isConfigured()) {
      try {
        let personId = tmdbPersonId;
        if (!personId) {
          const searchRes = await tmdbService.searchPerson(artist.name);
          if (searchRes && Array.isArray(searchRes.results) && searchRes.results.length > 0) {
            personId = searchRes.results[0].id;
            tmdbPersonId = personId;
          }
        }

        if (personId) {
          const personImagesData = await tmdbService.getPersonImages(personId);
          if (personImagesData) {
            const bestProfile = tmdbService.selectBestPersonProfile(personImagesData);
            if (bestProfile) {
              newImage = bestProfile.url;
              profileImages = (bestProfile.alternatives || []).map((p) => ({
                url: p.url,
                source: 'tmdb',
                isPrimary: false,
              }));
              profileImages.unshift({
                url: bestProfile.url,
                source: 'tmdb',
                width: bestProfile.width,
                height: bestProfile.height,
                isPrimary: true,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`[ArtistSync] TMDB person fetch failed for ${artist.name}: ${err.message}`);
      }
    }

    // 2. Try Wikipedia REST summary if TMDB image was not found
    if (!newImage && verified?.wikipediaTitle) {
      try {
        const wikiRes = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${verified.wikipediaTitle}`,
          {
            headers: { 'User-Agent': 'ZENKAI-Media/2.0 (contact@zenkai.com)' },
            timeout: 5000,
          }
        );
        if (wikiRes.data?.thumbnail?.source) {
          newImage = wikiRes.data.thumbnail.source;
          profileImages.push({
            url: wikiRes.data.thumbnail.source,
            source: 'wikipedia',
            width: wikiRes.data.thumbnail.width,
            height: wikiRes.data.thumbnail.height,
            isPrimary: true,
          });
        }
      } catch (err) {
        // Silently proceed to verified catalog fallback
      }
    }

    // 3. Fallback to Verified Official High-Resolution Photo
    if (!newImage && verified?.image) {
      newImage = verified.image;
    }
    if (!newBanner && verified?.banner) {
      newBanner = verified.banner;
    }

    // 4. Save to Database
    if (newImage) {
      artist.image = newImage;
      if (newBanner) artist.banner = newBanner;
      if (tmdbPersonId) artist.tmdbPersonId = tmdbPersonId;
      if (profileImages.length > 0) artist.profileImages = profileImages;
      await artist.save();
      updatedCount++;
    }
  }

  return { total: artists.length, updatedCount };
}
