import { load, publicProfile } from '../../lib/db';

// GET /api/feed -> profiles the user has not swiped on yet
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const db = load();
  const feed = db.profiles.filter(p => !(p.id in db.swipes)).map(publicProfile);
  res.json(feed);
}
