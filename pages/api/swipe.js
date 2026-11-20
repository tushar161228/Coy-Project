import { load, save, publicProfile } from '../../lib/db';

// POST /api/swipe { profileId, direction: 'like' | 'pass' } -> { match, profile? }
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { profileId, direction } = req.body || {};
  if (!['like', 'pass'].includes(direction)) return res.status(400).json({ error: 'direction must be like or pass' });

  const db = load();
  const profile = db.profiles.find(p => p.id === profileId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  if (profileId in db.swipes) return res.status(409).json({ error: 'Already swiped' });

  db.swipes[profileId] = direction;
  // Match only if BOTH sides liked each other.
  const match = direction === 'like' && profile.likedMe === true;
  if (match) db.matches.push({ profileId, at: new Date().toISOString() });
  save(db);

  res.json({ match, profile: match ? publicProfile(profile) : undefined });
}
