export function drawHistogram(canvas, counts, highlight = null) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const labels = Object.keys(counts).sort();
  if (!labels.length) return;
  const max = Math.max(...Object.values(counts));
  const barW = (w - 40) / labels.length;
  const palette = ["#6ee7ff", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"];

  labels.forEach((label, i) => {
    const val = counts[label];
    const barH = (val / max) * (h - 50);
    const x = 20 + i * barW + 4;
    const y = h - 24 - barH;
    ctx.fillStyle = label === highlight ? "#f472b6" : palette[i % palette.length];
    ctx.fillRect(x, y, barW - 8, barH);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x + (barW - 8) / 2, h - 8);
    ctx.fillText(String(val), x + (barW - 8) / 2, y - 4);
  });
}

export function drawCircuit(svg, demo) {
  svg.innerHTML = "";
  const ns = "http://www.w3.org/2000/svg";
  const qubits = demo.qubits;
  const rowH = 36;
  const colW = 56;
  const pad = 24;
  const width = pad * 2 + (demo.gates.length + 1) * colW;
  const height = pad * 2 + qubits * rowH;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  for (let q = 0; q < qubits; q++) {
    const y = pad + q * rowH + rowH / 2;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", pad);
    line.setAttribute("x2", width - pad);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#475569");
    svg.appendChild(line);

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", 8);
    label.setAttribute("y", y + 4);
    label.setAttribute("fill", "#94a3b8");
    label.setAttribute("font-size", "12");
    label.textContent = `q${q}`;
    svg.appendChild(label);
  }

  demo.gates.forEach((gate, col) => {
    const x = pad + (col + 1) * colW;
    if (gate.name === "measure") {
      gate.qubits.forEach((q) => drawMeasure(svg, ns, x, pad + q * rowH + rowH / 2));
      return;
    }
    if (gate.name === "grover_oracle") {
      drawBox(svg, ns, x - 20, pad + 4, 40, qubits * rowH - 8, "O");
      return;
    }
    if (gate.name === "grover_diffuser") {
      drawBox(svg, ns, x - 20, pad + 4, 40, qubits * rowH - 8, "D");
      return;
    }
    if (gate.name === "cnot" || gate.name === "cx" || gate.name === "ccx") {
      drawMultiQubitGate(svg, ns, gate, x, pad, rowH);
      return;
    }
    gate.qubits.forEach((q) => {
      const y = pad + q * rowH + rowH / 2;
      drawGateSymbol(svg, ns, gate.name, x, y);
    });
  });
}

function drawGateSymbol(svg, ns, name, x, y) {
  const circle = document.createElementNS(ns, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 14);
  circle.setAttribute("fill", "#1e293b");
  circle.setAttribute("stroke", "#38bdf8");
  svg.appendChild(circle);

  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 4);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#e2e8f0");
  text.setAttribute("font-size", "12");
  text.textContent = name.toUpperCase();
  svg.appendChild(text);
}

function drawMeasure(svg, ns, x, y) {
  const g = document.createElementNS(ns, "g");
  const arc = document.createElementNS(ns, "path");
  arc.setAttribute("d", `M ${x - 10} ${y} A 10 10 0 0 1 ${x + 10} ${y}`);
  arc.setAttribute("fill", "none");
  arc.setAttribute("stroke", "#fbbf24");
  arc.setAttribute("stroke-width", "2");
  g.appendChild(arc);
  const line = document.createElementNS(ns, "line");
  line.setAttribute("x1", x + 10);
  line.setAttribute("x2", x + 18);
  line.setAttribute("y1", y);
  line.setAttribute("y2", y - 8);
  line.setAttribute("stroke", "#fbbf24");
  g.appendChild(line);
  svg.appendChild(g);
}

function drawBox(svg, ns, x, y, w, h, label) {
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", w);
  rect.setAttribute("height", h);
  rect.setAttribute("rx", 6);
  rect.setAttribute("fill", "#312e81");
  rect.setAttribute("stroke", "#818cf8");
  svg.appendChild(rect);
  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", x + w / 2);
  text.setAttribute("y", y + h / 2 + 4);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#e0e7ff");
  text.textContent = label;
  svg.appendChild(text);
}

function drawMultiQubitGate(svg, ns, gate, x, pad, rowH) {
  const qs = gate.qubits;
  const minQ = Math.min(...qs);
  const maxQ = Math.max(...qs);
  const y0 = pad + minQ * rowH + rowH / 2;
  const y1 = pad + maxQ * rowH + rowH / 2;
  if (gate.name === "ccx") {
    const yMid = pad + qs[1] * rowH + rowH / 2;
    drawControlDot(svg, ns, x, y0);
    drawControlDot(svg, ns, x, yMid);
    drawTarget(svg, ns, x, y1);
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", x);
    line.setAttribute("x2", x);
    line.setAttribute("y1", y0);
    line.setAttribute("y2", y1);
    line.setAttribute("stroke", "#64748b");
    svg.appendChild(line);
  }
}

function drawControlDot(svg, ns, x, y) {
  const c = document.createElementNS(ns, "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", 5);
  c.setAttribute("fill", "#94a3b8");
  svg.appendChild(c);
}

function drawTarget(svg, ns, x, y) {
  const outer = document.createElementNS(ns, "circle");
  outer.setAttribute("cx", x);
  outer.setAttribute("cy", y);
  outer.setAttribute("r", 12);
  outer.setAttribute("fill", "none");
  outer.setAttribute("stroke", "#38bdf8");
  svg.appendChild(outer);
  const inner = document.createElementNS(ns, "line");
  inner.setAttribute("x1", x - 8);
  inner.setAttribute("x2", x + 8);
  inner.setAttribute("y1", y);
  inner.setAttribute("y2", y);
  inner.setAttribute("stroke", "#38bdf8");
  svg.appendChild(inner);
  const inner2 = document.createElementNS(ns, "line");
  inner2.setAttribute("x1", x);
  inner2.setAttribute("x2", x);
  inner2.setAttribute("y1", y - 8);
  inner2.setAttribute("y2", y + 8);
  inner2.setAttribute("stroke", "#38bdf8");
  svg.appendChild(inner2);
}

export function drawBloch(canvas, vector) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  ctx.strokeStyle = "#334155";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#475569";
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx, cy + r);
  ctx.stroke();

  const nx = cx + vector.x * r;
  const ny = cy - vector.z * r;
  ctx.strokeStyle = "#f472b6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(nx, ny);
  ctx.stroke();
  ctx.fillStyle = "#f472b6";
  ctx.beginPath();
  ctx.arc(nx, ny, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPortfolioBars(canvas, labels, weights) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const colors = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24"];
  labels.forEach((label, i) => {
    const barH = weights[i] * (h - 40);
    const x = 20 + i * ((w - 40) / labels.length);
    const bw = (w - 40) / labels.length - 8;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, h - 20 - barH, bw, barH);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, x + bw / 2, h - 4);
    ctx.fillText(`${(weights[i] * 100).toFixed(1)}%`, x + bw / 2, h - 24 - barH);
  });
}
