"""Grover search demo — find the marked swap route among liquidity pools."""

from __future__ import annotations

from dataclasses import dataclass
import math

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator


@dataclass(frozen=True)
class SwapSearchResult:
    marked_index: int
    marked_route: str
    routes: list[str]
    counts: dict[str, int]
    success_probability: float


class SwapRouteGrover:
    """3-qubit Grover search over 8 candidate swap routes."""

    def __init__(
        self,
        routes: list[str] | None = None,
        marked_index: int = 5,
        seed: int | None = None,
    ) -> None:
        self.routes = routes or [
            "TON->USDT",
            "USDT->BTC",
            "BTC->ETH",
            "ETH->TON",
            "TON->BTC",
            "BTC->USDT",
            "USDT->ETH",
            "ETH->USDT",
        ]
        if len(self.routes) != 8:
            raise ValueError("SwapRouteGrover expects exactly 8 routes")
        if marked_index < 0 or marked_index > 7:
            raise ValueError("marked_index must be 0..7")
        self.marked_index = marked_index
        self.seed = seed

    def _oracle(self) -> QuantumCircuit:
        qc = QuantumCircuit(3)
        # Flip phase of |marked_index>
        bits = format(self.marked_index, "03b")
        for i, bit in enumerate(reversed(bits)):
            if bit == "0":
                qc.x(i)
        qc.h(2)
        qc.ccx(0, 1, 2)
        qc.h(2)
        for i, bit in enumerate(reversed(bits)):
            if bit == "0":
                qc.x(i)
        return qc

    def _diffuser(self) -> QuantumCircuit:
        qc = QuantumCircuit(3)
        qc.h([0, 1, 2])
        qc.x([0, 1, 2])
        qc.h(2)
        qc.ccx(0, 1, 2)
        qc.h(2)
        qc.x([0, 1, 2])
        qc.h([0, 1, 2])
        return qc

    def build_circuit(self) -> QuantumCircuit:
        qc = QuantumCircuit(3, 3)
        qc.h([0, 1, 2])
        qc.compose(self._oracle(), inplace=True)
        qc.compose(self._diffuser(), inplace=True)
        qc.measure([0, 1, 2], [0, 1, 2])
        return qc

    def run(self, shots: int = 2048) -> SwapSearchResult:
        simulator = AerSimulator(seed_simulator=self.seed)
        job = simulator.run(transpile(self.build_circuit(), simulator), shots=shots)
        counts = job.result().get_counts()
        marked_bitstring = format(self.marked_index, "03b")
        hits = counts.get(marked_bitstring, 0)
        return SwapSearchResult(
            marked_index=self.marked_index,
            marked_route=self.routes[self.marked_index],
            routes=self.routes,
            counts=counts,
            success_probability=hits / shots,
        )

    def to_playground_spec(self, shots: int = 2048) -> dict:
        result = self.run(shots=shots)
        return {
            "id": "grover",
            "title": "Swap Route Grover Search",
            "description": "Quadratic speedup demo for finding the best pool among eight routes.",
            "qubits": 3,
            "classical_bits": 3,
            "routes": self.routes,
            "marked_index": self.marked_index,
            "marked_route": result.marked_route,
            "gates": [
                {"name": "h", "qubits": [0, 1, 2]},
                {"name": "grover_oracle", "marked_index": self.marked_index},
                {"name": "grover_diffuser", "qubits": 3},
                {"name": "measure", "qubits": [0, 1, 2]},
            ],
            "reference_counts": result.counts,
            "reference_success": result.success_probability,
            "theoretical_success": math.sin(3 * math.asin(1 / math.sqrt(8))) ** 2,
            "shots": shots,
            "hsp_hooks": ["blockchain", "api", "ai"],
        }
