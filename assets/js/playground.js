import { StatevectorSimulator, compareCounts } from "./simulator.js";
import {
  drawHistogram,
  drawCircuit,
  drawBloch,
  drawPortfolioBars,
} from "./visualizer.js";

const STORAGE_KEY = "quirkt_api_url";
const CUSTOM_API_FLAG = "quirkt_api_custom";
const DEFAULT_API_URL = "https://quirkt-production.up.railway.app";

const INTEGRATION_COPY = {
  oracle: {
    summary: "Feed uniform random bits into TON commit-reveal deals and wallet nonce derivation.",
    hooks: [
      { module: "blockchain/", action: "Replace pseudo-RNG seeds in deal escrow with oracle output." },
      { module: "api/", action: "Expose POST /api/quirkt/oracle returning signed bitstrings." },
      { module: "telegram/", action: "Mini App button: 'Roll quantum nonce' before confirming a swap." },
    ],
  },
  portfolio: {
    summary: "Blend quantum-sampled weights into OpenAI portfolio prompts for diversified recommendations.",
    hooks: [
      { module: "ai/", action: "Append allocation vector to recommendation context JSON." },
      { module: "api/", action: "Cron job runs QAOA sampler nightly; cache weights in Neon." },
      { module: "blockchain/", action: "Map weights to rebalance hints for Swap.Coffee routes." },
    ],
  },
  grover: {
    summary: "Prototype quadratic-speed route search among bounded liquidity pools.",
    hooks: [
      { module: "blockchain/", action: "Pre-filter 8 candidate pools before on-chain quote calls." },
      { module: "api/", action: "Grover microservice behind /api/quirkt/swap-search." },
      { module: "ai/", action: "Explain chosen route to users via AI Transmitter chat." },
    ],
  },
};

let payload = null;
let activeDemo = null;
let apiUrl = "";

function normalizeApiUrl(raw) {
  if (!raw) return "";
  let url = raw.trim().replace(/\/+$/, "");
  if (url && !/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

function getApiUrlFromQuery() {
  const param = new URLSearchParams(window.location.search).get("api");
  return normalizeApiUrl(param || "");
}

async function loadApiConfig() {
  const fromQuery = getApiUrlFromQuery();
  if (fromQuery) {
    apiUrl = fromQuery;
    localStorage.setItem(STORAGE_KEY, apiUrl);
    localStorage.removeItem(CUSTOM_API_FLAG);
    return;
  }

  let configured = DEFAULT_API_URL;
  try {
    const res = await fetch("./assets/config.json");
    if (res.ok) {
      const cfg = await res.json();
      configured = normalizeApiUrl(cfg.apiUrl || "") || DEFAULT_API_URL;
    }
  } catch {
    configured = DEFAULT_API_URL;
  }

  const stored = normalizeApiUrl(localStorage.getItem(STORAGE_KEY) || "");
  const userCustom = localStorage.getItem(CUSTOM_API_FLAG) === "true";
  apiUrl = userCustom && stored ? stored : configured;
}

function syncApiInput() {
  const input = document.getElementById("api-url-input");
  if (input) input.value = apiUrl;
}

function setApiStatus(text, kind = "") {
  const el = document.getElementById("api-status-badge");
  if (!el) return;
  el.textContent = text;
  el.className = "badge " + kind;
}

async function checkApiHealth() {
  if (!apiUrl) {
    setApiStatus("Railway API not configured", "warn");
    return false;
  }
  try {
    const res = await fetch(`${apiUrl}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await res.json();
    setApiStatus("Railway API connected", "ok");
    return true;
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg === "Failed to fetch") {
      setApiStatus("Blocked by CORS — set QUIRKT_ALLOWED_ORIGINS on Railway", "warn");
    } else {
      setApiStatus(`API error: ${msg}`, "warn");
    }
    return false;
  }
}

function saveApiUrl() {
  const input = document.getElementById("api-url-input");
  apiUrl = normalizeApiUrl(input?.value || "") || DEFAULT_API_URL;
  localStorage.setItem(STORAGE_KEY, apiUrl);
  localStorage.setItem(CUSTOM_API_FLAG, "true");
  checkApiHealth();
}

async function loadPayload() {
  const res = await fetch("./assets/data/playground.json");
  if (!res.ok) throw new Error("Could not load playground.json — run scripts/build_playground_data.py");
  payload = await res.json();
}

function renderDemoList() {
  const list = document.getElementById("demo-list");
  list.innerHTML = "";
  payload.demos.forEach((demo, index) => {
    const btn = document.createElement("button");
    btn.className = "demo-tab" + (index === 0 ? " active" : "");
    btn.textContent = demo.title;
    btn.addEventListener("click", () => selectDemo(demo.id));
    list.appendChild(btn);
  });
}

function selectDemo(id) {
  activeDemo = payload.demos.find((d) => d.id === id);
  document.querySelectorAll(".demo-tab").forEach((el) => {
    el.classList.toggle("active", el.textContent === activeDemo.title);
  });
  document.getElementById("demo-title").textContent = activeDemo.title;
  document.getElementById("demo-desc").textContent = activeDemo.description;
  drawCircuit(document.getElementById("circuit-svg"), activeDemo);
  renderIntegration(activeDemo.id);
  runSimulation("browser");
}

function renderIntegration(demoId) {
  const block = INTEGRATION_COPY[demoId];
  const el = document.getElementById("integration-panel");
  el.innerHTML = `
    <p class="integration-summary">${block.summary}</p>
    <ul class="integration-hooks">
      ${block.hooks
        .map((h) => `<li><code>${h.module}</code> — ${h.action}</li>`)
        .join("")}
    </ul>
    <p class="integration-footer">
      Live Qiskit runs on <strong>Railway</strong>; this page on <strong>GitHub Pages</strong> calls
      <code>POST /api/run</code>. See
      <a href="https://github.com/HyperlinksSpace/HyperlinksSpaceProgram" target="_blank" rel="noopener">HyperlinksSpaceProgram</a>
      / Railway sidecar pattern (TDLib gateway).
    </p>
  `;
}

function computeWeightsFromCounts(counts, labels) {
  const buckets = { "00": 0, "01": 0, "10": 0, "11": 0 };
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  for (const [bitstring, count] of Object.entries(counts)) {
    const key = bitstring.replace(/\s/g, "").slice(-2);
    if (key in buckets) buckets[key] += count;
  }
  return labels.map((_, i) => buckets[["00", "01", "10", "11"][i]] / total);
}

function renderResults(counts, shots, mode, highlight = null, liveMeta = null) {
  drawHistogram(document.getElementById("hist-canvas"), counts, highlight);

  const sim = new StatevectorSimulator(activeDemo.qubits);
  sim.runCircuit(
    activeDemo.gates.filter((g) => g.name !== "measure"),
    Math.min(shots, 512)
  );
  drawBloch(document.getElementById("bloch-canvas"), sim.blochVector(0));

  const metrics = document.getElementById("metrics");
  const validation = document.getElementById("validation-badge");

  if (mode === "browser") {
    const ref = activeDemo.reference_counts;
    const { delta, ok } = compareCounts(counts, ref);
    validation.textContent = ok
      ? "Browser sim ~ Qiskit reference"
      : `Drift ${(delta * 100).toFixed(1)}% — re-run or increase shots`;
    validation.className = "badge " + (ok ? "ok" : "warn");
  } else {
    validation.textContent = "Live Qiskit (Railway)";
    validation.className = "badge ok";
  }

  if (activeDemo.id === "portfolio") {
    const labels = liveMeta?.labels || activeDemo.labels;
    const weights =
      liveMeta?.weights || computeWeightsFromCounts(counts, activeDemo.labels);
    drawPortfolioBars(document.getElementById("portfolio-canvas"), labels, weights);
    document.getElementById("portfolio-panel").hidden = false;
    metrics.innerHTML = `
      <div>Expectation: <strong>${(liveMeta?.expectation ?? weights.reduce((s, w, i) => s + w * (i + 1), 0) / 4).toFixed(4)}</strong></div>
      <div>Engine: <strong>${mode === "railway" ? "qiskit-aer" : "js-statevector"}</strong></div>
    `;
  } else if (activeDemo.id === "grover") {
    document.getElementById("portfolio-panel").hidden = true;
    const marked = highlight;
    const hitRate = (counts[marked] || 0) / shots;
    const route = liveMeta?.marked_route || activeDemo.marked_route;
    metrics.innerHTML = `
      <div>Marked route: <strong>${route}</strong></div>
      <div>Success rate: <strong>${(hitRate * 100).toFixed(1)}%</strong></div>
    `;
  } else {
    document.getElementById("portfolio-panel").hidden = true;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const bits = liveMeta?.bits || top?.[0] || "—";
    metrics.innerHTML = `
      <div>Top bitstring: <strong>${bits}</strong></div>
      <div>Engine: <strong>${mode === "railway" ? "qiskit-aer" : "js-statevector"}</strong></div>
    `;
  }
}

function runSimulation(mode = "browser") {
  const shots = Number(document.getElementById("shots-input").value) || activeDemo.shots;
  const sim = new StatevectorSimulator(activeDemo.qubits);
  const counts = sim.runCircuit(
    activeDemo.gates.filter((g) => g.name !== "measure"),
    shots
  );

  let highlight = null;
  if (activeDemo.id === "grover") {
    highlight = activeDemo.marked_index.toString(2).padStart(3, "0");
  } else if (activeDemo.id === "oracle") {
    highlight = activeDemo.reference_top;
  }

  renderResults(counts, shots, mode, highlight);
}

async function runLiveQiskit() {
  if (!apiUrl) {
    setApiStatus("Set Railway API URL first", "warn");
    return;
  }

  const shots = Number(document.getElementById("shots-input").value) || activeDemo.shots;
  const validation = document.getElementById("validation-badge");
  validation.textContent = "Running on Railway…";
  validation.className = "badge";

  const params = new URLSearchParams({ shots: String(shots) });
  if (activeDemo.id === "grover") {
    params.set("marked_index", String(activeDemo.marked_index));
  }

  try {
    const res = await fetch(`${apiUrl}/api/run/${activeDemo.id}?${params}`, {
      method: "GET",
    });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(detail || `HTTP ${res.status}`);
    }
    const data = await res.json();
    let highlight = null;
    if (activeDemo.id === "grover") {
      highlight = data.marked_index.toString(2).padStart(3, "0");
    } else if (activeDemo.id === "oracle") {
      highlight = data.bits;
    }
    renderResults(data.counts, shots, "railway", highlight, data);
    setApiStatus("Railway API connected", "ok");
  } catch (err) {
    validation.textContent = "Railway run failed";
    validation.className = "badge warn";
    setApiStatus(String(err.message || err), "warn");
  }
}

async function init() {
  await loadApiConfig();
  await loadPayload();
  syncApiInput();
  document.getElementById("meta-seed").textContent = payload.seed;
  document.getElementById("run-btn").addEventListener("click", () => runSimulation("browser"));
  document.getElementById("run-railway-btn").addEventListener("click", runLiveQiskit);
  document.getElementById("save-api-btn").addEventListener("click", saveApiUrl);
  document.getElementById("shots-input").addEventListener("change", () => runSimulation("browser"));
  renderDemoList();
  selectDemo(payload.demos[0].id);
  await checkApiHealth();
}

init().catch((err) => {
  document.body.innerHTML = `<main class="error">${err.message}</main>`;
});
