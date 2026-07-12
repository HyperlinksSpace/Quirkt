import { StatevectorSimulator } from "./simulator.js";
import {
  drawHistogram,
  drawCircuit,
  drawBloch,
  drawPortfolioBars,
} from "./visualizer.js";
import { STRINGS, t } from "./i18n.js";

const DEFAULT_API_URL =
  globalThis.QUIRKT_DEFAULT_API || "https://quirkt-production.up.railway.app";
const LANG_KEY = "quirkt_lang";
const SHOTS = 2048;

let payload = null;
let activeDemo = null;
let lang = "en";

function getApiBase() {
  return DEFAULT_API_URL.replace(/\/+$/, "");
}

function loadLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && STRINGS[saved]) lang = saved;
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q && STRINGS[q]) lang = q;
}

function saveLang(code) {
  lang = code;
  localStorage.setItem(LANG_KEY, code);
  document.documentElement.lang = code === "zh" ? "zh-Hans" : code;
}

function $(id) {
  return document.getElementById(id);
}

function setBadge(id, text, kind = "") {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.className = "badge " + kind;
}

function applyStaticTranslations() {
  document.title = t(lang, "pageTitle");
  $("hero-title").textContent = t(lang, "heroTitle");
  $("hero-lead").textContent = t(lang, "heroLead");
  $("sidebar-demos-label").textContent = t(lang, "sidebarDemos");
  $("hist-title").textContent = t(lang, "histTitle");
  $("hist-hint").textContent = t(lang, "histHint");
  $("bloch-title").textContent = t(lang, "blochTitle");
  $("bloch-hint").textContent = t(lang, "blochHint");
  $("portfolio-title").textContent = t(lang, "portfolioTitle");
  $("portfolio-hint").textContent = t(lang, "portfolioHint");
  $("integration-title").textContent = t(lang, "integrationTitle");
  $("roadmap-title").textContent = t(lang, "roadmapTitle");
  $("run-again-btn").textContent = t(lang, "runAgain");
  setBadge("badge-live", t(lang, "badgeLive"), "");
  setBadge("badge-ready", t(lang, "badgeReady"), "ok");

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  const list = $("roadmap-list");
  list.innerHTML = t(lang, "roadmap")
    .map((item) => `<li>${item}</li>`)
    .join("");
}

async function loadPayload() {
  const res = await fetch("./assets/data/playground.json");
  if (!res.ok) throw new Error("playground.json missing");
  payload = await res.json();
}

function renderDemoList() {
  const list = $("demo-list");
  list.innerHTML = "";
  payload.demos.forEach((demo, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "demo-tab" + (index === 0 ? " active" : "");
    btn.dataset.demoId = demo.id;
    btn.textContent = t(lang, `demos.${demo.id}.title`);
    btn.addEventListener("click", () => selectDemo(demo.id));
    list.appendChild(btn);
  });
}

function selectDemo(id) {
  activeDemo = payload.demos.find((d) => d.id === id);
  document.querySelectorAll(".demo-tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.demoId === id);
  });
  $("demo-title").textContent = t(lang, `demos.${id}.title`);
  $("demo-desc").textContent = t(lang, `demos.${id}.desc`);
  $("integration-panel").innerHTML = `<p class="integration-summary">${t(lang, `demos.${id}.integration`)}</p>`;
  drawCircuit($("circuit-svg"), activeDemo);
  runLiveQiskit();
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

function renderResults(counts, liveMeta = null, highlight = null) {
  drawHistogram($("hist-canvas"), counts, highlight);

  const sim = new StatevectorSimulator(activeDemo.qubits);
  sim.runCircuit(
    activeDemo.gates.filter((g) => g.name !== "measure"),
    512
  );
  drawBloch($("bloch-canvas"), sim.blochVector(0));

  const metrics = $("metrics");
  if (activeDemo.id === "portfolio") {
    const labels = liveMeta?.labels || activeDemo.labels;
    const weights = liveMeta?.weights || computeWeightsFromCounts(counts, labels);
    drawPortfolioBars($("portfolio-canvas"), labels, weights);
    $("portfolio-panel").hidden = false;
    metrics.innerHTML = `<div>${t(lang, "metricSplit")}: <strong>${labels.map((l, i) => `${l} ${(weights[i] * 100).toFixed(0)}%`).join(", ")}</strong></div>`;
  } else if (activeDemo.id === "grover") {
    $("portfolio-panel").hidden = true;
    const marked = highlight;
    const hitRate = (counts[marked] || 0) / SHOTS;
    const route = liveMeta?.marked_route || activeDemo.marked_route;
    metrics.innerHTML = `
      <div>${t(lang, "metricRoute")}: <strong>${route}</strong></div>
      <div>${t(lang, "metricSuccess")}: <strong>${(hitRate * 100).toFixed(0)}%</strong></div>`;
  } else {
    $("portfolio-panel").hidden = true;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const bits = liveMeta?.bits || top?.[0] || "—";
    metrics.innerHTML = `<div>${t(lang, "metricTopBits")}: <strong>${bits}</strong></div>`;
  }
}

async function checkApiHealth() {
  setBadge("api-status-badge", t(lang, "badgeConnecting"), "");
  try {
    const res = await fetch(`${getApiBase()}/health`);
    if (!res.ok) throw new Error("bad status");
    setBadge("api-status-badge", t(lang, "badgeConnected"), "ok");
    return true;
  } catch {
    setBadge("api-status-badge", t(lang, "badgeOffline"), "warn");
    return false;
  }
}

async function runLiveQiskit() {
  if (!activeDemo) return;
  setBadge("run-status-badge", t(lang, "running"), "");

  const params = new URLSearchParams({ shots: String(SHOTS) });
  if (activeDemo.id === "grover") {
    params.set("marked_index", String(activeDemo.marked_index));
  }

  try {
    const res = await fetch(`${getApiBase()}/api/run/${activeDemo.id}?${params}`);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    let highlight = null;
    if (activeDemo.id === "grover") {
      highlight = data.marked_index.toString(2).padStart(3, "0");
    } else if (activeDemo.id === "oracle") {
      highlight = data.bits;
    }
    renderResults(data.counts, data, highlight);
    setBadge("run-status-badge", t(lang, "runOk"), "ok");
    setBadge("api-status-badge", t(lang, "badgeConnected"), "ok");
    $("results-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch {
    setBadge("run-status-badge", t(lang, "runFail"), "warn");
  }
}

function bindLangSwitcher() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      saveLang(btn.dataset.lang);
      applyStaticTranslations();
      renderDemoList();
      if (activeDemo) selectDemo(activeDemo.id);
    });
  });
}

async function init() {
  loadLang();
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
  applyStaticTranslations();
  bindLangSwitcher();
  await loadPayload();
  renderDemoList();
  $("run-again-btn").addEventListener("click", runLiveQiskit);
  selectDemo(payload.demos[0].id);
  await checkApiHealth();
}

init().catch((err) => {
  document.body.innerHTML = `<main class="error">${err.message}</main>`;
});
