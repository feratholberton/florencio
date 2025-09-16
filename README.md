# Florencio (Fake Elio project)

The server will be used to expose 3 pieces of data
- session_id
- age
- sex

This will be a read-only, fake data API so downstream clients can integrate and test while the real source is unavailable. Think of it as a data faucet: it only serves the three fields and never lets anyone change anything.

at the endpoint `/api/start`

The client (a React App) will load this data


