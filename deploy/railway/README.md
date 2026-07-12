# Deploy Quirkt API on Railway

The Python/Qiskit backend runs as a **FastAPI** service. GitHub Pages serves the static playground; the playground calls this API for **live Qiskit Aer** shots.

## 1. Create the Railway service

1. Open [Railway](https://railway.app/dashboard) and **New Project → Deploy from GitHub repo**.
2. Select this repository.
3. Railway reads [`railway.toml`](../railway.toml) and builds from the root [`Dockerfile`](../Dockerfile).
4. After deploy, open the service → **Settings → Networking → Generate Domain** (e.g. `https://quirkt-api-production.up.railway.app`).

## 2. Set environment variables

In Railway → your service → **Variables**:

| Variable | Example | Purpose |
|----------|---------|---------|
| `QUIRKT_ALLOWED_ORIGINS` | `https://youruser.github.io,http://localhost:8080` | CORS — must include your GitHub Pages origin |
| `PORT` | *(set by Railway automatically)* | Listen port |

**Important:** GitHub Pages sends `Origin: https://<user>.github.io` (no repo path). Add that exact URL, comma-separated if you have several.

Optional local testing:

```bash
export QUIRKT_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
pip install -r requirements-server.txt
uvicorn server.main:app --reload --port 8000
curl http://localhost:8000/health
```

## 3. Link GitHub Pages to Railway

You have **three ways** to point the playground at your Railway URL (pick one or combine):

### A. Playground UI (fastest)

1. Open your GitHub Pages site: `https://<user>.github.io/<repo>/`
2. Paste the Railway domain into **Railway API URL** (no trailing slash).
3. Click **Save** — stored in `localStorage` for that browser.
4. Click **Run live Qiskit (Railway)** on any demo.

### B. Committed config (team-wide default)

Edit [`assets/config.json`](../assets/config.json):

```json
{
  "apiUrl": "https://quirkt-api-production.up.railway.app"
}
```

Commit and push. GitHub Actions redeploys Pages; every visitor gets the API pre-linked.

### C. URL query parameter (one-off share)

```
https://youruser.github.io/Quirkt/?api=https://quirkt-api-production.up.railway.app
```

## 4. Verify the link

1. Railway: `GET https://<your-domain>/health` → `{ "status": "ok", ... }`
2. Railway: `GET https://<your-domain>/api/run/oracle?shots=256` → JSON with `counts`
3. GitHub Pages: open playground → badge should show **Railway API connected**
4. Click **Run live Qiskit (Railway)** → badge **Live Qiskit (Railway)**

If CORS fails, double-check `QUIRKT_ALLOWED_ORIGINS` matches the browser origin exactly (scheme + host, no path).

## API reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness + configured CORS origins |
| `GET` | `/api/playground?seed=42&shots=2048` | Full playground JSON (live Qiskit) |
| `GET` | `/api/run/{demo}` | Run demo (`oracle`, `portfolio`, `grover`) |
| `POST` | `/api/run` | Same with JSON body |

Example:

```bash
curl "https://<domain>/api/run/grover?shots=1024&marked_index=5"
```

## Hyperlinks Space Program pattern

This mirrors HSP’s [TDLib gateway on Railway](https://github.com/HyperlinksSpace/HyperlinksSpaceProgram/blob/main/deploy/railway/README.md):

- **GitHub Pages / Expo web** = static frontend
- **Railway** = long-running Python sidecar with Qiskit
- Set frontend env/config to the Railway public URL after deploy

Future HSP merge: mount under `deploy/railway/quirkt-api/` or call from `api/quirkt/` proxy on Vercel.
