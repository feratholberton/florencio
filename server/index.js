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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
