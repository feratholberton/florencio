import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type SubmitResponse =
  | { ok: true; relayed_status: number; relayed_body: unknown }
  | { ok: false; error: string };

const API_BASE =
  ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '');

function useParamsObject() {
  const { search } = useLocation();
  return useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]) as {
    session_id?: string;
    age?: string;
    sex?: string;
    return_address?: string;
  };
}

function validate(p: ReturnType<typeof useParamsObject>): string[] {
  const errors: string[] = [];
  if (!p.session_id) errors.push('Missing session_id');
  const n = Number(p.age);
  if (!Number.isInteger(n) || n < 0 || n > 140) errors.push('Invalid age');
  if (!/^(M|F)$/.test(p.sex ?? '')) errors.push('Invalid sex');
  try { new URL(p.return_address ?? ''); } catch { errors.push('Invalid return_address'); }
  return errors;
}

export default function Elio() {
  const params = useParamsObject();
  const { session_id, age, sex, return_address } = params;

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const problems = validate(params);
  const canSend = text.trim().length > 0 && problems.length === 0 && !sending;

  const handleSend = async () => {
    setSending(true);
    setErr(null);
    setResult(null);
    try {
      const r = await fetch(`${API_BASE}/api/elio/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          session_id,
          age: Number(age),
          sex,
          text,
          return_address
        })
      });
      const ct = r.headers.get('content-type') ?? '';
      const body = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${body.slice(0, 200)}`);
      if (!ct.includes('application/json')) throw new Error('Expected JSON response');
      setResult(JSON.parse(body) as SubmitResponse);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container">
      <h1>Elio</h1>

      {problems.length > 0 && (
        <div className="error">
          <ul>{problems.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      )}

      <section className="info">
        <div><strong>Session ID:</strong> <code>{session_id}</code></div>
        <div><strong>Return Address:</strong> <code>{return_address}</code></div>
        <div><strong>Sex:</strong> {sex}</div>
        <div><strong>Age:</strong> {age}</div>
      </section>

      <label htmlFor="notes"><strong>Notes</strong></label>
      <textarea
        id="notes"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="textarea"
        placeholder="Write something…"
      />

      <div className="actions">
        <button onClick={handleSend} disabled={!canSend}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>

      {err && <p className="error">{err}</p>}
      {result && (
        <details open>
          <summary>Server response</summary>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </details>
      )}
    </main>
  );
}
