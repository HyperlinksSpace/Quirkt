# Quirkt

**Quantum Risk & Allocation Kit** — a Qiskit module built to plug into [Hyperlinks Space Program](https://github.com/HyperlinksSpace/HyperlinksSpaceProgram) (AI + blockchain trading, Telegram Mini App, TON wallets).

![Playground](https://img.shields.io/badge/GitHub%20Pages-playground-38bdf8)
![Qiskit](https://img.shields.io/badge/Qiskit-local%20%2B%20reference-a78bfa)

## What it does

| Module | Quantum idea | HSP use case |
|--------|--------------|--------------|
| **Oracle** | Hadamard QRNG | Commit-reveal deal salts, wallet nonces |
| **Portfolio** | QAOA-style 2-qubit sampler | AI recommendation diversification |
| **Grover** | 3-qubit search | Fast pick among 8 swap routes |

## Try the playground (GitHub Pages)

Root `index.html` loads the interactive demo — circuit diagram, histogram, Bloch hint, and integration notes.

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → GitHub Actions** (or branch `main` / root).
3. Open `https://<user>.github.io/<repo>/`.

The browser runs a **pure-JS statevector simulator** for offline demos. For **live Qiskit**, link the playground to a **Railway** API (see below).

## Deploy Python on Railway + link GitHub Pages

Full guide: [`deploy/railway/README.md`](./deploy/railway/README.md)

### Railway (Qiskit API)

1. [Railway](https://railway.app/dashboard) → **New Project → Deploy from GitHub repo** → select this repo.
2. Railway builds from root [`Dockerfile`](./Dockerfile) via [`railway.toml`](./railway.toml).
3. **Settings → Networking → Generate Domain** → copy URL (e.g. `https://quirkt-api-production.up.railway.app`).
4. **Variables** → set:
   ```
   QUIRKT_ALLOWED_ORIGINS=https://<your-github-username>.github.io
   ```
   Add `http://localhost:8080` for local testing. Redeploy if needed.

Verify: `curl https://<your-domain>/health`

### Link GitHub Pages → Railway

Pick one:

| Method | How |
|--------|-----|
| **Playground UI** | Open Pages site → paste Railway URL in sidebar → **Save** → **Run live Qiskit (Railway)** |
| **config.json** | Set `"apiUrl"` in [`assets/config.json`](./assets/config.json), commit, push |
| **Query param** | `https://<user>.github.io/<repo>/?api=https://<railway-domain>` |

GitHub Pages stays static at repo root (`index.html`). Railway runs `server/main.py` (FastAPI + Qiskit Aer). CORS on Railway must list your Pages origin exactly.

## Local Qiskit setup

```bash
pip install qiskit qiskit-aer numpy
# or
pip install -r requirements.txt
```

```bash
python scripts/run_local_demo.py
python scripts/build_playground_data.py   # refresh playground.json
pytest
```

## Structure (HSP-aligned)

```
quirkt/           # Python package — drop beside ai/, blockchain/, api/
server/           # FastAPI app for Railway
scripts/          # Local demo + playground export
assets/           # CSS, JS simulator, config.json, playground.json
deploy/railway/   # Railway deploy guide
docs/             # Integration guide for HyperlinksSpaceProgram
index.html        # GitHub Pages entry (repo root)
Dockerfile        # Railway container build
tests/            # Qiskit Aer + API tests
```

## Integration with Hyperlinks Space Program

Detailed hooks: [`docs/hsp-integration.md`](./docs/hsp-integration.md).

### Near-term

- **`research/quirkt/`** — vendored copy of this repo inside HSP monorepo.
- **`api/quirkt/*`** — Vercel proxy to Railway Quirkt service (or merge `server/` into HSP monorepo).
- **Expo WebView** — embed playground URL in a Telegram Mini App screen.
- **`ai/`** — append portfolio weights to OpenAI context for swap/trade suggestions.
- **`blockchain/`** — oracle bits as entropy input before TON escrow commits.

### Medium-term

- Signed oracle payloads via existing GCP KMS wallet pipeline.
- Swap.Coffee pool list fed into Grover backend instead of static 8 routes.
- Neon table `quirkt_snapshots` for cached nightly portfolio vectors.

### Long-term

- Hybrid classical–quantum route optimizer as a Railway sidecar (like TDLib gateway).
- On-chain verification of commit hashes that reference published oracle transcripts.

## Why two runtimes?

| Environment | Engine | Reason |
|-------------|--------|--------|
| Railway API | **Qiskit + Aer** | Live shots for GitHub Pages playground |
| Local / CI | **Qiskit + Aer** | Tests, playground.json export |
| GitHub Pages | **JS statevector** | Static hosting fallback / offline demo |

Run `scripts/build_playground_data.py` after changing circuits so the playground stays in sync.

## Contributing (HSP style)

- Focused commits per module (oracle / portfolio / grover / playground).
- Regenerate `assets/data/playground.json` when circuits change.
- No secrets in static assets.
- Compatible with dual GitHub + GitLab push workflow described in HSP README.

## License

MIT — suitable for fork into HyperlinksSpaceProgram.
