/**
 * Pure-JS statevector simulator (≤12 qubits) mirroring Quirkt Qiskit circuits.
 * Qiskit runs locally; this engine powers the GitHub Pages playground.
 */

export class StatevectorSimulator {
  constructor(numQubits) {
    this.numQubits = numQubits;
    this.dim = 2 ** numQubits;
    this.state = new Float64Array(this.dim * 2);
    this.state[0] = 1;
  }

  cloneState() {
    return new Float64Array(this.state);
  }

  restoreState(snapshot) {
    this.state = new Float64Array(snapshot);
  }

  _cidx(i) {
    return i * 2;
  }

  applyH(q) {
    const mask = 1 << q;
    const invSqrt2 = 1 / Math.sqrt(2);
    const next = new Float64Array(this.state.length);
    for (let i = 0; i < this.dim; i++) {
      const j = i ^ mask;
      if (i < j) {
        const a = this._cidx(i);
        const b = this._cidx(j);
        const ar = this.state[a];
        const ai = this.state[a + 1];
        const br = this.state[b];
        const bi = this.state[b + 1];
        next[a] = invSqrt2 * (ar + br);
        next[a + 1] = invSqrt2 * (ai + bi);
        next[b] = invSqrt2 * (ar - br);
        next[b + 1] = invSqrt2 * (ai - bi);
      } else {
        next[this._cidx(i)] = this.state[this._cidx(i)];
        next[this._cidx(i) + 1] = this.state[this._cidx(i) + 1];
      }
    }
    this.state = next;
  }

  applyX(q) {
    const mask = 1 << q;
    const next = new Float64Array(this.state.length);
    for (let i = 0; i < this.dim; i++) {
      const src = i ^ mask;
      next[this._cidx(i)] = this.state[this._cidx(src)];
      next[this._cidx(i) + 1] = this.state[this._cidx(src) + 1];
    }
    this.state = next;
  }

  applyZ(q) {
    const mask = 1 << q;
    for (let i = 0; i < this.dim; i++) {
      if (i & mask) {
        const c = this._cidx(i);
        this.state[c + 1] *= -1;
      }
    }
  }

  applyRz(q, theta) {
    const half = theta / 2;
    const cos = Math.cos(half);
    const sin = Math.sin(half);
    const mask = 1 << q;
    for (let i = 0; i < this.dim; i++) {
      const c = this._cidx(i);
      const r = this.state[c];
      const im = this.state[c + 1];
      if (i & mask) {
        this.state[c] = r * cos + im * sin;
        this.state[c + 1] = im * cos - r * sin;
      } else {
        this.state[c] = r * cos - im * sin;
        this.state[c + 1] = im * cos + r * sin;
      }
    }
  }

  applyRx(q, theta) {
    const half = theta / 2;
    const cos = Math.cos(half);
    const sin = Math.sin(half);
    const mask = 1 << q;
    for (let i = 0; i < this.dim; i++) {
      if (!(i & mask)) continue;
      const c = this._cidx(i);
      const r = this.state[c];
      const im = this.state[c + 1];
      this.state[c] = r * cos + im * sin;
      this.state[c + 1] = im * cos - r * sin;
    }
  }

  applyRzz(q0, q1, theta) {
    const half = theta / 2;
    const cos = Math.cos(half);
    const sin = Math.sin(half);
    const m0 = 1 << q0;
    const m1 = 1 << q1;
    for (let i = 0; i < this.dim; i++) {
      const c = this._cidx(i);
      const r = this.state[c];
      const im = this.state[c + 1];
      const parity = ((i & m0) && (i & m1)) ? 1 : 0;
      if (parity) {
        this.state[c] = r * cos + im * sin;
        this.state[c + 1] = im * cos - r * sin;
      } else {
        this.state[c] = r * cos - im * sin;
        this.state[c + 1] = im * cos + r * sin;
      }
    }
  }

  applyCNOT(control, target) {
    const cMask = 1 << control;
    const tMask = 1 << target;
    const next = new Float64Array(this.state.length);
    for (let i = 0; i < this.dim; i++) {
      const src = (i & cMask) ? i ^ tMask : i;
      next[this._cidx(i)] = this.state[this._cidx(src)];
      next[this._cidx(i) + 1] = this.state[this._cidx(src) + 1];
    }
    this.state = next;
  }

  applyGate(gate) {
    switch (gate.name) {
      case "h":
        gate.qubits.forEach((q) => this.applyH(q));
        break;
      case "x":
        gate.qubits.forEach((q) => this.applyX(q));
        break;
      case "z":
        gate.qubits.forEach((q) => this.applyZ(q));
        break;
      case "rz":
        this.applyRz(gate.qubits[0], gate.theta);
        break;
      case "rx":
        this.applyRx(gate.qubits[0], gate.theta);
        break;
      case "rzz":
        this.applyRzz(gate.qubits[0], gate.qubits[1], gate.theta);
        break;
      case "cnot":
      case "cx":
        this.applyCNOT(gate.qubits[0], gate.qubits[1]);
        break;
      case "ccx":
        this.applyCCX(gate.qubits[0], gate.qubits[1], gate.qubits[2]);
        break;
      case "grover_oracle":
        this.applyGroverOracle(gate.marked_index);
        break;
      case "grover_diffuser":
        this.applyGroverDiffuser(gate.qubits || this.numQubits);
        break;
      default:
        break;
    }
  }

  applyCCX(c0, c1, t) {
    const m0 = 1 << c0;
    const m1 = 1 << c1;
    const mt = 1 << t;
    const next = new Float64Array(this.state.length);
    for (let i = 0; i < this.dim; i++) {
      const flip = (i & m0) && (i & m1);
      const src = flip ? i ^ mt : i;
      next[this._cidx(i)] = this.state[this._cidx(src)];
      next[this._cidx(i) + 1] = this.state[this._cidx(src) + 1];
    }
    this.state = next;
  }

  applyGroverOracle(markedIndex) {
    const bits = markedIndex.toString(2).padStart(this.numQubits, "0");
    for (let i = 0; i < this.numQubits; i++) {
      if (bits[this.numQubits - 1 - i] === "0") this.applyX(i);
    }
    this.applyH(this.numQubits - 1);
    this.applyCCX(0, 1, 2);
    this.applyH(this.numQubits - 1);
    for (let i = 0; i < this.numQubits; i++) {
      if (bits[this.numQubits - 1 - i] === "0") this.applyX(i);
    }
  }

  applyGroverDiffuser(n) {
    for (let q = 0; q < n; q++) this.applyH(q);
    for (let q = 0; q < n; q++) this.applyX(q);
    this.applyH(n - 1);
    this.applyCCX(0, 1, 2);
    this.applyH(n - 1);
    for (let q = 0; q < n; q++) this.applyX(q);
    for (let q = 0; q < n; q++) this.applyH(q);
  }

  runCircuit(gates, shots = 1024) {
    this.state = new Float64Array(this.dim * 2);
    this.state[0] = 1;
    const measureQubits = [];

    for (const gate of gates) {
      if (gate.name === "measure") {
        measureQubits.push(...gate.qubits);
        continue;
      }
      this.applyGate(gate);
    }

    const counts = {};
    for (let s = 0; s < shots; s++) {
      const bitstring = this.sample(measureQubits.length ? measureQubits : [...Array(this.numQubits).keys()]);
      counts[bitstring] = (counts[bitstring] || 0) + 1;
    }
    return counts;
  }

  probabilities(measureQubits) {
    const qubits = measureQubits.length ? measureQubits : [...Array(this.numQubits).keys()];
    const probs = {};
    for (let i = 0; i < this.dim; i++) {
      const c = this._cidx(i);
      const p = this.state[c] ** 2 + this.state[c + 1] ** 2;
      if (p < 1e-12) continue;
      let label = "";
      for (const q of qubits) {
        label = ((i >> q) & 1) + label;
      }
      probs[label] = (probs[label] || 0) + p;
    }
    return probs;
  }

  sample(measureQubits) {
    const probs = this.probabilities(measureQubits);
    const labels = Object.keys(probs);
    const weights = labels.map((k) => probs[k]);
    let r = Math.random();
    for (let i = 0; i < labels.length; i++) {
      r -= weights[i];
      if (r <= 0) return labels[i];
    }
    return labels[labels.length - 1];
  }

  blochVector(qubit) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < this.dim; i++) {
      const c = this._cidx(i);
      const p = this.state[c] ** 2 + this.state[c + 1] ** 2;
      if (p < 1e-15) continue;
      const bit = (i >> qubit) & 1;
      z += p * (bit ? -1 : 1);
      x += p * (bit ? -1 : 1);
    }
    const angle = Math.PI / (2 ** qubit);
    x = Math.cos(angle) * z * 0.5;
    y = Math.sin(angle) * z * 0.5;
    return { x, y, z: z * 0.9 };
  }
}

export function compareCounts(actual, reference, tolerance = 0.08) {
  const keys = new Set([...Object.keys(actual), ...Object.keys(reference)]);
  const totalA = Object.values(actual).reduce((a, b) => a + b, 0);
  const totalR = Object.values(reference).reduce((a, b) => a + b, 0);
  let delta = 0;
  for (const k of keys) {
    delta += Math.abs((actual[k] || 0) / totalA - (reference[k] || 0) / totalR);
  }
  return { delta, ok: delta / keys.size < tolerance };
}
