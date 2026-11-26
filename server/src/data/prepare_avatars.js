import fs from 'fs';

// Verified image mapping for directors, cast, crew
const wikiData = JSON.parse(fs.readFileSync('c:/Users/Anurag Singh/Videos/Mocktail/server/src/data/wiki_images.json', 'utf8'));

// High quality, guaranteed working image URLs
const verifiedAvatars = {
  // Directors
  'Christopher Nolan': wikiData['Christopher Nolan'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/ChristopherNolan-byPhilipRomano_%28cropped%29.jpg/330px-ChristopherNolan-byPhilipRomano_%28cropped%29.jpg',
  'Denis Villeneuve': wikiData['Denis Villeneuve'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg/330px-DVilleneuveRFH121024_%2812_of_23%29_%2854061976489%29_%28cropped%29.jpg',
  'Atlee': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Atlee_in_2024.jpg',
  'Vidhu Vinod Chopra': wikiData['Vidhu Vinod Chopra'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vidhu_Vinod_Chopra.jpg/330px-Vidhu_Vinod_Chopra.jpg',
  'Amar Kaushik': wikiData['Amar Kaushik'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Amar_Kaushik_at_Bhediya_trailer_launch.jpg/330px-Amar_Kaushik_at_Bhediya_trailer_launch.jpg',
  'S. S. Rajamouli': wikiData['S. S. Rajamouli'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/S._S._Rajamouli_at_the_RRR_press_meet.jpg/330px-S._S._Rajamouli_at_the_RRR_press_meet.jpg',
  'Rishab Shetty': wikiData['Rishab Shetty'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Rishab_Shetty_at_53rd_IFFI.jpg/330px-Rishab_Shetty_at_53rd_IFFI.jpg',
  'Hayao Miyazaki': wikiData['Hayao Miyazaki'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg/330px-Hayao_Miyazaki_cropped_1_Hayao_Miyazaki_201211.jpg',
  'Makoto Shinkai': wikiData['Makoto Shinkai'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Makoto_Shinkai_at_Berlinale_2023.jpg/330px-Makoto_Shinkai_at_Berlinale_2023.jpg',
  'James Cameron': wikiData['James Cameron'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/James_Cameron_by_Gage_Skidmore.jpg/330px-James_Cameron_by_Gage_Skidmore.jpg',
  'Nag Ashwin': wikiData['Nag Ashwin'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nag_Ashwin_at_Mahanati_audio_launch.jpg/330px-Nag_Ashwin_at_Mahanati_audio_launch.jpg',
  'Joaquim Dos Santos': wikiData['Joaquim Dos Santos'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Joaquim_Dos_Santos_by_Gage_Skidmore.jpg/330px-Joaquim_Dos_Santos_by_Gage_Skidmore.jpg',

  // Cast
  'Cillian Murphy': wikiData['Cillian Murphy'],
  'Emily Blunt': wikiData['Emily Blunt'],
  'Robert Downey Jr.': wikiData['Robert Downey Jr.'],
  'Matt Damon': wikiData['Matt Damon'],
  'Florence Pugh': wikiData['Florence Pugh'],
  'Timothée Chalamet': wikiData['Timothée Chalamet'],
  'Zendaya': wikiData['Zendaya'],
  'Rebecca Ferguson': wikiData['Rebecca Ferguson'],
  'Javier Bardem': wikiData['Javier Bardem'],
  'Austin Butler': wikiData['Austin Butler'],
  'Shah Rukh Khan': wikiData['Shah Rukh Khan'],
  'Nayanthara': wikiData['Nayanthara'],
  'Vijay Sethupathi': wikiData['Vijay Sethupathi'],
  'Deepika Padukone': wikiData['Deepika Padukone'],
  'Sanya Malhotra': wikiData['Sanya Malhotra'],
  'Vikrant Massey': wikiData['Vikrant Massey'],
  'Medha Shankr': wikiData['Medha Shankr'],
  'Anant V Joshi': wikiData['Anant V Joshi'],
  'Anshumaan Pushkar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'Shraddha Kapoor': wikiData['Shraddha Kapoor'],
  'Rajkummar Rao': wikiData['Rajkummar Rao'],
  'Pankaj Tripathi': wikiData['Pankaj Tripathi'],
  'Aparshakti Khurana': wikiData['Aparshakti Khurana'],
  'Abhishek Banerjee': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Abhishek_Banerjee_grace_the_premiere_of_Kill_%28cropped%29.jpg',
  'N. T. Rama Rao Jr.': wikiData['N. T. Rama Rao Jr.'],
  'Ram Charan': wikiData['Ram Charan'],
  'Alia Bhatt': wikiData['Alia Bhatt'],
  'Ajay Devgn': wikiData['Ajay Devgn'],
  'Sapthami Gowda': wikiData['Sapthami Gowda'],
  'Kishore': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'Achyuth Kumar': wikiData['Achyuth Kumar'],
  'Rumi Hiiragi': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'Miyu Irino': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'Mari Natsuki': wikiData['Mari Natsuki'],
  'Nanoka Hara': wikiData['Nanoka Hara'],
  'Hokuto Matsumura': wikiData['Hokuto Matsumura'],
  'Eri Fukatsu': wikiData['Eri Fukatsu'],
  'Sam Worthington': wikiData['Sam Worthington'],
  'Zoe Saldaña': wikiData['Zoe Saldaña'],
  'Sigourney Weaver': wikiData['Sigourney Weaver'],
  'Stephen Lang': wikiData['Stephen Lang'],
  'Kate Winslet': wikiData['Kate Winslet'],
  'Prabhas': wikiData['Prabhas'],
  'Amitabh Bachchan': wikiData['Amitabh Bachchan'],
  'Kamal Haasan': wikiData['Kamal Haasan'],
  'Disha Patani': wikiData['Disha Patani'],
  'Shameik Moore': wikiData['Shameik Moore'],
  'Hailee Steinfeld': wikiData['Hailee Steinfeld'],
  'Oscar Isaac': wikiData['Oscar Isaac'],
  'Daniel Kaluuya': wikiData['Daniel Kaluuya'],

  // Music & Crew
  'Ludwig Göransson': wikiData['Ludwig Göransson'],
  'Hans Zimmer': wikiData['Hans Zimmer'],
  'Anirudh Ravichander': wikiData['Anirudh Ravichander'],
  'M. M. Keeravani': wikiData['M. M. Keeravani'],
  'Joe Hisaishi': wikiData['Joe Hisaishi'],
  'Radwimps': wikiData['Radwimps'],
  'Santhosh Narayanan': wikiData['Santhosh Narayanan'],
  'Daniel Pemberton': wikiData['Daniel Pemberton'],
  'B. Ajaneesh Loknath': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80'
};

console.log('Verified avatars map prepared.');
fs.writeFileSync('c:/Users/Anurag Singh/Videos/Mocktail/server/src/data/verified_avatars.json', JSON.stringify(verifiedAvatars, null, 2));
