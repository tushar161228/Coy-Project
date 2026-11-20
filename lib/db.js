// Tiny JSON-file database. Persists swipes + matches across reloads/restarts.
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'db.json');

const NAMES = ['Aarav','Priya','Rohan','Ananya','Kabir','Isha','Vihaan','Meera','Arjun','Diya',
  'Aditya','Saanvi','Reyansh','Kiara','Ishaan','Tara','Dev','Nisha','Yash','Riya',
  'Karan','Pooja','Neil','Sara','Varun','Anika','Sameer','Zoya','Rahul','Mira',
  'Tanvi','Harsh','Naina','Dhruv'];
const PLACES = ['IIT Delhi','Delhi University','Christ University','BITS Pilani','Ashoka University',
  'Mumbai','Bengaluru','Pune','Hyderabad','Jaipur','Ghaziabad','Noida'];
const INTERESTS = ['Music','Travel','Coffee','Movies','Gaming','Football','Cooking','Photography',
  'Books','Hiking','Coding','Dancing','Art','Cricket','Yoga','Anime'];
const BIOS = ['Chai over coffee, always.','Looking for someone to share playlists with.',
  'Weekend trekker, weekday overthinker.','Will beat you at FIFA.',
  'Dog person. Sorry, cat people.','Late-night maggi enthusiast.',
  'Fluent in sarcasm and memes.','Always up for a road trip.'];

function seed() {
  const profiles = NAMES.map((name, i) => ({
    id: i + 1,
    name,
    age: 18 + (i * 7) % 9,
    photo: `https://picsum.photos/seed/coy${i + 1}/600/800`,
    bio: BIOS[i % BIOS.length],
    place: PLACES[i % PLACES.length],
    interests: [0, 1, 2].map(k => INTERESTS[(i * 3 + k * 5) % INTERESTS.length]),
    // PRIVATE: has this profile already liked the logged-in user? Never sent to client.
    likedMe: i % 3 === 0,
  }));
  return { profiles, swipes: {}, matches: [] };
}

export function load() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

export function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function reset() {
  save(seed());
}

// Strip private fields before sending to the client.
export function publicProfile({ likedMe, ...pub }) {
  return pub;
}
