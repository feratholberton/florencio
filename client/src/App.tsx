import { useState } from 'react';
import './App.css';

function App() {
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState<Error | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL || "";
  
  const ping = async () => {
    setErr(null);
    setResp(null);
    try {
      const r = await fetch(`${API_BASE}/api/hello`);
      const data = await r.json();
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
          {err && <p>{err.message}</p>}
        </div>
      </main>
    </>
  );
};

export default App;
