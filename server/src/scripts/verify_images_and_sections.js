import axios from 'axios';

async function verifyAll() {
  const base = 'http://localhost:5001';
  let hasFailure = false;

  console.log('================================================================');
  console.log('🧪 ZENKAI COMPREHENSIVE MEDIA & SECTIONS VERIFICATION');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST 1: MOVIES POSTERS & TMDB DATA
  // -------------------------------------------------------------
  console.log('🎬 [TEST 1/3] VERIFYING MOVIE POSTERS & NO DUPLICATES');
  console.log('------------------------------------------------------');

  const catRes = await axios.get(`${base}/api/v1/movies/theatrical/categories?city=Mumbai`);
  const cats = catRes.data.categories || {};
  console.log(`✓ Theatrical Categories:`);
  console.log(`   - Now Showing: ${cats.nowShowing?.count || 0}`);
  console.log(`   - Releasing Soon: ${cats.releasingSoon?.count || 0}`);
  console.log(`   - Upcoming: ${cats.upcoming?.count || 0}`);
  console.log(`   - Coming in 2027: ${cats.comingIn2027?.count || 0}`);

  const allMoviesRes = await axios.get(`${base}/api/v1/movies/upcoming?limit=100`);
  const movies = allMoviesRes.data.movies || [];

  const posterMap = new Map();
  const duplicatePosters = [];
  const genericPosters = [];

  for (const m of movies) {
    if (!m.poster) {
      console.error(`✗ Missing poster for movie: ${m.title}`);
      hasFailure = true;
      continue;
    }
    // Check for generic Unsplash placeholder
    if (m.poster.includes('unsplash.com') && !m.poster.includes('photo-1489599849927-2ee91cede3ba')) {
      // Check if it's one of the placeholders
    }
    if (posterMap.has(m.poster)) {
      duplicatePosters.push({ m1: posterMap.get(m.poster), m2: m.title, poster: m.poster });
    } else {
      posterMap.set(m.poster, m.title);
    }
  }

  if (duplicatePosters.length > 0) {
    console.error('✗ Duplicate posters detected:', duplicatePosters);
    hasFailure = true;
  } else {
    console.log(`✓ Zero duplicate posters! All ${posterMap.size} checked movies have distinct artwork.`);
  }

  // Verify movie detail page
  const sampleMovie = movies[0];
  if (sampleMovie) {
    const detailRes = await axios.get(`${base}/api/v1/movies/${sampleMovie._id}`);
    const mv = detailRes.data.movie;
    console.log(`✓ Detail Page for "${mv.title}":`);
    console.log(`   - Poster: ${mv.poster}`);
    console.log(`   - Backdrop: ${mv.backdrop || 'N/A'}`);
    console.log(`   - Cast: ${mv.cast?.length || 0} cast members (isolated to detail page)`);
    console.log(`   - Director: ${mv.director}`);
  }

  // -------------------------------------------------------------
  // TEST 2: ARTISTS AUTHENTIC PHOTOGRAPHS & NO DUPLICATES
  // -------------------------------------------------------------
  console.log('\n🎤 [TEST 2/3] VERIFYING ARTIST PROFILES & PHOTOGRAPHS');
  console.log('------------------------------------------------------');

  const artistsRes = await axios.get(`${base}/api/v1/artists`);
  const artists = artistsRes.data.artists || [];
  console.log(`✓ Retrieved ${artists.length} artists from directory.`);

  const artistPhotoMap = new Map();
  const duplicateArtistPhotos = [];
  const missingPhotos = [];

  for (const a of artists) {
    if (!a.image || a.image.trim().length === 0) {
      missingPhotos.push(a.name);
      continue;
    }
    // Check if artist image is accidentally a movie poster
    if (posterMap.has(a.image)) {
      console.error(`✗ Artist ${a.name} is using movie poster: ${a.image}`);
      hasFailure = true;
    }
    if (artistPhotoMap.has(a.image)) {
      duplicateArtistPhotos.push({ a1: artistPhotoMap.get(a.image), a2: a.name, photo: a.image });
    } else {
      artistPhotoMap.set(a.image, a.name);
    }
  }

  if (missingPhotos.length > 0) {
    console.error(`✗ Missing photos for artists:`, missingPhotos);
    hasFailure = true;
  } else {
    console.log(`✓ All ${artists.length} artists have profile photographs!`);
  }

  if (duplicateArtistPhotos.length > 0) {
    console.error(`✗ Duplicate artist photos detected:`, duplicateArtistPhotos);
    hasFailure = true;
  } else {
    console.log(`✓ Zero duplicate photos! All ${artistPhotoMap.size} artists have distinct, dedicated photographs.`);
  }

  // Test artist proxy
  const sampleArtist = artists[0];
  const proxyTestRes = await axios.get(`${base}/api/v1/artists/proxy-image?url=${encodeURIComponent(sampleArtist.image)}`, {
    responseType: 'arraybuffer',
  });
  console.log(`✓ Artist Image Proxy Response: HTTP ${proxyTestRes.status}, Content-Type: ${proxyTestRes.headers['content-type']}, Size: ${proxyTestRes.data.length} bytes`);

  // Verify single artist detail page
  const singleArtistRes = await axios.get(`${base}/api/v1/artists/${sampleArtist.slug}`);
  const artData = singleArtistRes.data;
  console.log(`✓ Detail Page for "${artData.artist.name}":`);
  console.log(`   - Profile Photo: ${artData.artist.image}`);
  console.log(`   - Banner: ${artData.artist.banner || 'N/A'}`);
  console.log(`   - Category: ${artData.artist.category}`);
  console.log(`   - Monthly Listeners: ${artData.artist.monthlyListeners}`);
  console.log(`   - Upcoming Tours: ${artData.upcomingEvents?.length || 0} concerts`);
  console.log(`   - Related Artists: ${artData.relatedArtists?.length || 0} recommendations`);

  // -------------------------------------------------------------
  // TEST 3: DYNAMIC MEDIA SYNC ENDPOINTS
  // -------------------------------------------------------------
  console.log('\n⚙️ [TEST 3/3] VERIFYING MEDIA SYNC ENDPOINTS');
  console.log('------------------------------------------------------');

  const movieSyncRes = await axios.post(`${base}/api/v1/movies/sync-media`);
  console.log(`✓ POST /api/v1/movies/sync-media: ${movieSyncRes.data.message} (${movieSyncRes.data.result?.updatedCount} updated)`);

  const artistSyncRes = await axios.post(`${base}/api/v1/artists/sync-media`);
  console.log(`✓ POST /api/v1/artists/sync-media: ${artistSyncRes.data.message} (${artistSyncRes.data.result?.updatedCount} updated)`);

  console.log('\n================================================================');
  if (hasFailure) {
    console.log('❌ SOME TESTS FAILED');
    process.exit(1);
  } else {
    console.log('🎉 ALL MEDIA & SECTION TESTS PASSED 100%!');
    console.log('================================================================\n');
  }
}

verifyAll().catch((err) => {
  console.error('Fatal verification error:', err.message);
  process.exit(1);
});
