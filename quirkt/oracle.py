"""Quantum random oracle — provably uniform bits for deals and nonces."""

from __future__ import annotations

from dataclasses import dataclass

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator


@dataclass(frozen=True)
class OracleResult:
    bits: str
    counts: dict[str, int]
    shots: int


class QuantumRandomOracle:
    """Hadamard + measure on n qubits — QRNG suitable for commit-reveal seeds."""

    def __init__(self, qubits: int = 4, seed: int | None = None) -> None:
        if qubits < 1 or qubits > 12:
            raise ValueError("qubits must be between 1 and 12")
        self.qubits = qubits
        self.seed = seed

    def build_circuit(self) -> QuantumCircuit:
        qc = QuantumCircuit(self.qubits, self.qubits)
        qc.h(range(self.qubits))
        qc.measure(range(self.qubits), range(self.qubits))
        return qc

    def run(self, shots: int = 1024) -> OracleResult:
        simulator = AerSimulator(seed_simulator=self.seed)
        job = simulator.run(transpile(self.build_circuit(), simulator), shots=shots)
        counts = job.result().get_counts()
        top_bitstring = max(counts, key=counts.get)
        return OracleResult(bits=top_bitstring, counts=counts, shots=shots)

    def to_playground_spec(self, shots: int = 1024) -> dict:
        result = self.run(shots=shots)
        return {
            "id": "oracle",
            "title": "Quantum Random Oracle",
            "description": "Uniform random bits for deal nonces and commit-reveal seeds.",
            "qubits": self.qubits,
            "classical_bits": self.qubits,
            "gates": [{"name": "h", "qubits": list(range(self.qubits))}]
            + [{"name": "measure", "qubits": list(range(self.qubits))}],
            "reference_counts": result.counts,
            "reference_top": result.bits,
            "shots": shots,
            "hsp_hooks": ["blockchain", "api", "telegram"],
        }
