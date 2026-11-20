import { useState } from 'react';
import Head from 'next/head';
import Discover from '../components/Discover';
import Matches from '../components/Matches';

const TABS = ['Home', 'Discover', 'Matches'];

export default function App() {
  const [tab, setTab] = useState('Discover');
  return (
    <div className="app">
      <Head>
        <title>Coy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <main className="screen">
        {tab === 'Home' && null /* intentionally blank */}
        {tab === 'Discover' && <Discover />}
        {tab === 'Matches' && <Matches />}
      </main>
      <nav className="tabbar">
        {TABS.map(t => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
    </div>
  );
}
