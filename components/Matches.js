import { useEffect, useState } from 'react';

export default function Matches() {
  const [list, setList] = useState(null);
  useEffect(() => { fetch('/api/matches').then(r => r.json()).then(setList); }, []);

  if (!list) return <p className="center">Loading…</p>;
  if (!list.length) {
    return (
      <div className="center empty">
        <h2>No matches yet</h2>
        <p>When you and someone like each other, they'll show up here.</p>
      </div>
    );
  }
  return (
    <div className="matches">
      <h2>Your matches</h2>
      <div className="grid">
        {list.map(m => (
          <div key={m.id} className="mcard">
            <img src={m.photo} alt={m.name} />
            <strong>{m.name}, {m.age}</strong>
            <small>{m.place}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
