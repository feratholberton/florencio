require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/healthz', (_req, res) => res.send('ok'));
app.get('/api/hello', (_req, res) => {
  res.json({ ok: true, message: 'Hello from Florencio API 👋' });
});

app.post('/api/elio/submit', async (req, res) => {
  const { session_id, age, sex, text, return_address } = req.body || {};
  const bad = (m) => res.status(400).json({ ok: false, error: m });

  if (!session_id) return bad('session_id required');
  if (!Number.isInteger(age) || age < 0 || age > 140) return bad('age must be integer in [0,140]');
  if (!/^(M|F)$/.test(sex || '')) return bad('sex must be "M" or "F"');
  if (!text || !String(text).trim()) return bad('text is required');

  const target = return_address || process.env.RETURN_ADDRESS || 'https://httpbin.org/post';
  try { new URL(target); } catch { return bad('invalid return_address'); }

  const payload = {
    session_id,
    age,
    sex,
    text,
    source: 'florencio',
    at: new Date().toISOString()
  };

  try {
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const raw = await r.text();
    let parsed; try { parsed = JSON.parse(raw); } catch { parsed = raw; }

    res.json({ ok: true, relayed_status: r.status, relayed_body: parsed });
  } catch (e) {
    res.status(502).json({ ok: false, error: `relay failed: ${e.message}` });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
