import { load, publicProfile } from '../../lib/db';

// GET /api/matches -> mutual matches only
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const db = load();
  const list = db.matches
    .map(m => ({ ...publicProfile(db.profiles.find(p => p.id === m.profileId)), matchedAt: m.at }))
    .reverse();
  res.json(list);
}
