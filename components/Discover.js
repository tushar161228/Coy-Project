import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 100; // px drag needed to count as a swipe

export default function Discover() {
  const [feed, setFeed] = useState(null);
  const [match, setMatch] = useState(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState(null); // 'like' | 'pass' while animating out
  const startX = useRef(0);
  const busy = useRef(false);

  const load = () => fetch('/api/feed').then(r => r.json()).then(setFeed);
  useEffect(() => { load(); }, []);

  async function swipe(direction) {
    if (busy.current || !feed?.length) return;
    busy.current = true;
    const profile = feed[0];
    setExit(direction);
    const res = await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id, direction }),
    }).then(r => r.json()).catch(() => null);
    setTimeout(() => {
      setFeed(f => f.slice(1));
      setExit(null);
      setDx(0);
      if (res?.match) setMatch(res.profile);
      busy.current = false;
    }, 250);
  }

  const onDown = e => {
    if (busy.current) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = e => dragging && setDx(e.clientX - startX.current);
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (dx > THRESHOLD) swipe('like');
    else if (dx < -THRESHOLD) swipe('pass');
    else setDx(0);
  };

  async function resetDemo() {
    await fetch('/api/reset', { method: 'POST' });
    load();
  }

  if (!feed) return <p className="center">Loading…</p>;

  if (match) {
    return (
      <div className="match">
        <h1>It's a match!</h1>
        <img src={match.photo} alt={match.name} />
        <p>You and {match.name} liked each other.</p>
        <button className="primary" onClick={() => setMatch(null)}>Keep swiping</button>
      </div>
    );
  }

  if (!feed.length) {
    return (
      <div className="center empty">
        <h2>You're all caught up</h2>
        <p>No more profiles right now. Check your Matches or come back later.</p>
        <button className="primary" onClick={resetDemo}>Reset demo data</button>
      </div>
    );
  }

  const p = feed[0];
  const x = exit === 'like' ? 500 : exit === 'pass' ? -500 : dx;
  const likeOpacity = Math.min(Math.max(x / THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-x / THRESHOLD, 0), 1);

  return (
    <div className="discover">
      {feed[1] && <div className="card behind"><img src={feed[1].photo} alt="" draggable={false} /></div>}
      <div
        className="card"
        style={{
          transform: `translateX(${x}px) rotate(${x / 20}deg)`,
          transition: dragging ? 'none' : 'transform 0.25s ease',
          opacity: exit ? 0.6 : 1,
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <img src={p.photo} alt={p.name} draggable={false} />
        <span className="stamp like" style={{ opacity: likeOpacity }}>LIKE</span>
        <span className="stamp pass" style={{ opacity: passOpacity }}>PASS</span>
        <div className="info">
          <h2>{p.name}, {p.age}</h2>
          <p className="place">{p.place}</p>
          <p>{p.bio}</p>
          <div className="tags">{p.interests.map(i => <span key={i}>{i}</span>)}</div>
        </div>
      </div>
      <div className="actions">
        <button className="btn pass" onClick={() => swipe('pass')} aria-label="Pass">✕</button>
        <button className="btn like" onClick={() => swipe('like')} aria-label="Like">♥</button>
      </div>
    </div>
  );
}
