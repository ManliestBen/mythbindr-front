import { useEffect, useState } from 'react';

type Health = {
  status: string;
  db: string;
  dbName: string;
  env: string;
};

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>MythBindr</h1>
      <p style={{ color: '#666' }}>Phase 0 — foundation skeleton.</p>

      <section style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0, fontSize: '1rem' }}>API / database status</h2>
        {error && <p style={{ color: '#b00' }}>✗ Could not reach API: {error}</p>}
        {!error && !health && <p>Checking…</p>}
        {health && (
          <ul style={{ lineHeight: 1.7 }}>
            <li>API: <strong>{health.status}</strong></li>
            <li>Database: <strong>{health.db}</strong> ({health.dbName})</li>
            <li>Environment: <strong>{health.env}</strong></li>
          </ul>
        )}
      </section>
    </main>
  );
}
