# Florencio (Fake Elio project)

## Node + Express + TypeScript

### How to start the server locally

- Go to the server directory `cd server`
- Run `npm start`

This is a read-only, fake data API so the clients can integrate and test while the real source is unavailable. Think of it as a data faucet: it only serves the three fields and never lets anyone change anything.

Fields to serve:
- session_id (UUID)
- age (integer 0-140)
- sex ('F' or 'M')