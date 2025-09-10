import { useState } from 'react';
import './App.css';

type HelloResponse = {
  ok: boolean;
  message: string;
};

function App() {
  const [resp, setResp] = useState<HelloResponse | null>(null);
  const [err, setErr] = useState<Error | null>(null);

  // Use absolute API base in prod, or empty string in dev to hit Vite proxy.
  const API_BASE =
    ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '');

  const ping = async () => {
    setErr(null);
    setResp(null);
    try {
      const url = `${API_BASE}/api/hello`;
      const r = await fetch(url, { headers: { Accept: 'application/json' } });

      const contentType = r.headers.get('content-type') ?? '';
      const text = await r.text();

      if (!r.ok) {
        throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`);
      }
      if (!contentType.includes('application/json')) {
        throw new Error(
          `Expected JSON but got '${contentType || 'unknown'}'. First bytes: ${text
            .replace(/\s+/g, ' ')
            .slice(0, 120)}…`
        );
      }

      const data = JSON.parse(text) as HelloResponse;
      setResp(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e : new Error(String(e)));
    }
  };

  return (
    <>
      <main>
        <h1>Florencio Client</h1>
        <p>Vite + React hello world.</p>
        <div className="card">
          <button onClick={ping}>Ping API</button>
          {resp && <pre>{JSON.stringify(resp, null, 2)}</pre>}
          {err && <p className="error">{err.message}</p>}
        </div>
      </main>
    </>
  );
}

export default App;
