import { reset } from '../../lib/db';

// POST /api/reset -> demo helper, restores seed data
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  reset();
  res.json({ ok: true });
}
