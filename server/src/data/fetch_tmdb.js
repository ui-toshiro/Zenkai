import https from 'https';
import fs from 'fs';

const movies = [
  { id: 872585, slug: 'oppenheimer', title: 'Oppenheimer' },
  { id: 693134, slug: 'dune-part-two', title: 'Dune: Part Two' },
  { id: 872906, slug: 'jawan', title: 'Jawan' },
  { id: 1184918, slug: '12th-fail', title: '12th Fail' },
  { id: 1111873, slug: 'stree-2', title: 'Stree 2' },
  { id: 579974, slug: 'rrr', title: 'RRR' },
  { id: 1024546, slug: 'kantara', title: 'Kantara' },
  { id: 129, slug: 'spirited-away', title: 'Spirited Away' },
  { id: 926393, slug: 'suzume', title: 'Suzume' },
  { id: 83533, slug: 'avatar-fire-and-ash', title: 'Avatar: Fire and Ash' },
  { id: 76341, slug: 'kalki-2898-ad-part-2', title: 'Kalki 2898 AD' },
  { id: 569094, slug: 'spider-man-across-the-spider-verse', title: 'Spider-Man: Across the Spider-Verse' }
];

function fetchPage(id) {
  return new Promise((resolve) => {
    const req = https.get('https://www.themoviedb.org/movie/' + id, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https:\/\/image\.tmdb\.org\/t\/p\/[a-zA-Z0-9_\/]+\.(jpg|jpeg|png|webp)/g) || [];
        resolve([...new Set(matches)]);
      });
    });
    req.on('error', () => resolve([]));
  });
}

async function run() {
  const result = {};
  for (const m of movies) {
    const urls = await fetchPage(m.id);
    result[m.slug] = urls;
    console.log(m.title, 'found images:', urls.length);
  }
  fs.writeFileSync('c:/Users/Anurag Singh/Videos/Mocktail/server/src/data/tmdb_scraped.json', JSON.stringify(result, null, 2));
}

run();
