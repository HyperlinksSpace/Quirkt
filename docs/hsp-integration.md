# Quirkt ↔ Hyperlinks Space Program integration

Quirkt is designed as a **research module** that mirrors the [HyperlinksSpaceProgram](https://github.com/HyperlinksSpace/HyperlinksSpaceProgram) layout and can be merged or imported alongside existing folders.

## Folder mapping

| Quirkt | HSP target | Purpose |
|--------|------------|---------|
| `quirkt/` | `research/quirkt/` or repo root sibling | Python Qiskit circuits |
| `assets/data/playground.json` | `assets/` or `dist/` static bundle | Reference histograms for web UI |
| `index.html` | Expo web route / iframe URL | Public playground |
| `scripts/build_playground_data.py` | `scripts/` | CI step before Pages deploy |

## Module integrations

### 1. Quantum Random Oracle → `blockchain/` + `api/`

- **Today:** Hadamard + measure on 4 qubits produces uniform bitstrings.
- **Integration:** Use output as commit salt before TON deal escrow reveals.
- **API sketch:** `POST /api/quirkt/oracle` → `{ bits, signature, shots }` signed with GCP KMS key already used for wallets.

### 2. Portfolio QAOA Sampler → `ai/` + Swap.Coffee

- **Today:** 2-qubit QAOA-style circuit maps measurement buckets to four asset labels (TON, USDT, BTC, ETH).
- **Integration:** Append weights to OpenAI system prompt in `ai/` so recommendations stay diversified.
- **Data:** Cache nightly weights in Neon; expose in Telegram Mini App portfolio screen.

### 3. Swap Route Grover → `blockchain/` + Swap.Coffee

- **Today:** Single Grover iteration marks one of eight routes (demo index 5 = BTC→USDT).
- **Integration:** Pre-filter candidate pools before expensive on-chain quote RPCs.
- **Future:** Replace static oracle with Swap.Coffee live pool IDs; run Grover on backend with Qiskit Aer.

## Telegram Mini App embed

```tsx
// app/screens/QuirktPlayground.tsx (proposed)
import { WebView } from "react-native-webview";

export function QuirktPlayground() {
  return (
    <WebView
      source={{ uri: "https://<your-org>.github.io/Quirkt/" }}
      style={{ flex: 1 }}
    />
  );
}
```

## Vercel serverless (live Qiskit)

For low latency at scale, proxy Railway from Vercel:

```typescript
// api/quirkt/oracle.ts (proposed) — forward to process.env.QUIRKT_RAILWAY_URL
```

**Recommended:** deploy [`server/main.py`](../server/main.py) on **Railway** (see [`deploy/railway/README.md`](../deploy/railway/README.md)) and point GitHub Pages at the public domain via [`assets/config.json`](../assets/config.json) or the playground sidebar.

## GitHub Pages ↔ Railway linking

1. Deploy repo to Railway → generate domain.
2. Set `QUIRKT_ALLOWED_ORIGINS=https://<github-user>.github.io` on Railway.
3. On GitHub Pages playground: paste Railway URL → **Save** → **Run live Qiskit (Railway)**.

Or commit `"apiUrl": "https://….up.railway.app"` in `assets/config.json`.

## Local Qiskit workflow

```bash
pip install qiskit qiskit-aer numpy
python scripts/build_playground_data.py
python scripts/run_local_demo.py
pytest
```

## Compliance notes

- No secrets in static assets; oracle bits in JSON are **reference samples** only.
- Aligns with HSP dependency policy: add `qiskit` to backend only, not Expo bundle.
- Dual-host contributors can mirror the same pattern used for GitHub + GitLab sync in HSP README.
