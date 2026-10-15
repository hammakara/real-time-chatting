# real-time-chatting

Real-time chat app built with the MERN stack. Messages are delivered over Socket.IO
with optimistic sending on the client and Cloudinary for image attachments.

## Features

- JWT auth in `httpOnly` cookies (login, register, logout, profile)
- Real-time messaging via Socket.IO with presence (online/offline) indicators
- Image attachments, 5 MB client-side cap, stored on Cloudinary
- Optimistic sending with de-duplication against the socket echo
- Auto-reconnect with backoff, plus a message refetch after a dropped connection
- Light/dark/system theme, responsive mobile layout

## Project structure

```
frontend/   Vite + React 19 + Tailwind 4 + daisyUI 5 + Zustand
server/     Express 5 + Mongoose + Socket.IO + Cloudinary + JWT
render.yaml Render blueprint for the API
```

## Local development

The API needs a running MongoDB instance and Cloudinary credentials.

```bash
# server
cd server
npm install
cp .env.example .env    # then fill in the values
npm run dev             # http://localhost:5001

# frontend (separate terminal)
cd frontend
npm install
npm run dev             # http://localhost:5173
```

## Environment variables

`server/.env`

| Variable | Notes |
| --- | --- |
| `MONGO_URI` | Use a MongoDB **Atlas** URI in any deployed environment |
| `JWT_SECRET` | Long random string. `JWT_EXPIRES_IN` defaults to `1d` |
| `CLIENT_URL` | Comma-separated allowed frontend origins, e.g. `https://app.vercel.app,http://localhost:5173` |
| `CLOUDINARY_*` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

`frontend/.env` — `VITE_BACKEND_URL` must be the API origin in production.

## Deployment

The frontend is deployed to **Vercel** (static) and the API to **Render**
(a persistent Node service).

This split is deliberate. The Socket.IO online-user map is held in memory, so it
is only correct on an instance that never scales out — which is why the API runs on
a long-lived Render service rather than on Vercel Functions, where connections are
pinned per instance and dropped at max duration.

### Deploy order

The two services reference each other, so deploy the API first:

1. Push this repo to GitHub.
2. In Render, create a **Blueprint** from `render.yaml`. Fill in the secrets marked
   `sync: false`: `MONGO_URI`, `CLIENT_URL`, and the three `CLOUDINARY_*` values.
   `JWT_SECRET` is generated for you.
3. Note the Render URL, e.g. `https://chatty-api.onrender.com`.
4. Set `VITE_BACKEND_URL` to that URL in the Vercel project settings.
5. `npx vercel --prod` in `frontend/`.
6. Add the Vercel domain to the `CLIENT_URL` value on Render and let it redeploy.

### Cross-origin cookies

When the frontend and API are on different domains the browser treats them as
cross-site. `server/src/libs/utils.js` therefore sets the auth cookie to
`SameSite=None; Secure` in production and `SameSite=Strict` in development — a
`Strict` cookie is never sent cross-site, so auth and the socket handshake would
fail with login appearing to succeed. `CLIENT_URL` must therefore list every
frontend origin exactly, or CORS rejects the requests.

The free Render tier sleeps when idle, which drops WebSocket connections. The
client reconnects automatically and refetches the active conversation on reconnect.
