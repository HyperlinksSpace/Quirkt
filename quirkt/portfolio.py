"""QAOA-inspired portfolio weight sampler for allocation hints."""

from __future__ import annotations

from dataclasses import dataclass
import math

import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit.circuit import Parameter
from qiskit_aer import AerSimulator


@dataclass(frozen=True)
class PortfolioResult:
    weights: list[float]
    labels: list[str]
    expectation: float
    counts: dict[str, int]


class PortfolioSampler:
    """Two-qubit QAOA-style circuit encoding risk/return trade-off."""

    def __init__(
        self,
        labels: list[str] | None = None,
        risk_penalty: float = 0.35,
        seed: int | None = None,
    ) -> None:
        self.labels = labels or ["TON", "USDT", "BTC", "ETH"]
        if len(self.labels) != 4:
            raise ValueError("PortfolioSampler expects exactly 4 asset labels")
        self.risk_penalty = risk_penalty
        self.seed = seed

    def build_circuit(self, gamma: float, beta: float) -> QuantumCircuit:
        qc = QuantumCircuit(2, 2)
        qc.h([0, 1])

        # Cost layer — encodes pairwise correlation penalty
        qc.rzz(2 * gamma * self.risk_penalty, 0, 1)
        qc.rz(2 * gamma * (1 - self.risk_penalty), 0)
        qc.rz(2 * gamma * (1 - self.risk_penalty), 1)

        # Mixer layer
        qc.rx(2 * beta, 0)
        qc.rx(2 * beta, 1)
        qc.measure([0, 1], [0, 1])
        return qc

    def _optimize_angles(self) -> tuple[float, float]:
        best = (0.0, 0.0)
        best_score = -math.inf
        for gamma in np.linspace(0.1, 1.2, 12):
            for beta in np.linspace(0.1, 1.2, 12):
                score = math.cos(gamma) * (1 - self.risk_penalty) + math.sin(beta) * 0.5
                if score > best_score:
                    best_score = score
                    best = (float(gamma), float(beta))
        return best

    def run(self, shots: int = 2048) -> PortfolioResult:
        gamma, beta = self._optimize_angles()
        qc = self.build_circuit(gamma, beta)
        simulator = AerSimulator(seed_simulator=self.seed)
        job = simulator.run(transpile(qc, simulator), shots=shots)
        counts = job.result().get_counts()

        # Map 2-bit states to four asset buckets (00, 01, 10, 11)
        total = sum(counts.values())
        bucket = {"00": 0, "01": 0, "10": 0, "11": 0}
        for bitstring, count in counts.items():
            key = bitstring.replace(" ", "")[-2:]
            bucket[key] = bucket.get(key, 0) + count

        weights = [bucket[k] / total for k in ("00", "01", "10", "11")]
        expectation = sum(w * (i + 1) for i, w in enumerate(weights)) / 4
        return PortfolioResult(
            weights=weights,
            labels=self.labels,
            expectation=expectation,
            counts=counts,
        )

    def to_playground_spec(self, shots: int = 2048) -> dict:
        gamma, beta = self._optimize_angles()
        result = self.run(shots=shots)
        return {
            "id": "portfolio",
            "title": "Portfolio QAOA Sampler",
            "description": "Quantum allocation hints for AI-backed portfolio recommendations.",
            "qubits": 2,
            "classical_bits": 2,
            "parameters": {"gamma": gamma, "beta": beta, "risk_penalty": self.risk_penalty},
            "labels": self.labels,
            "gates": [
                {"name": "h", "qubits": [0, 1]},
                {"name": "rzz", "qubits": [0, 1], "theta": 2 * gamma * self.risk_penalty},
                {"name": "rz", "qubits": [0], "theta": 2 * gamma * (1 - self.risk_penalty)},
                {"name": "rz", "qubits": [1], "theta": 2 * gamma * (1 - self.risk_penalty)},
                {"name": "rx", "qubits": [0], "theta": 2 * beta},
                {"name": "rx", "qubits": [1], "theta": 2 * beta},
                {"name": "measure", "qubits": [0, 1]},
            ],
            "reference_weights": result.weights,
            "reference_counts": result.counts,
            "reference_expectation": result.expectation,
            "shots": shots,
            "hsp_hooks": ["ai", "api", "blockchain"],
        }
