"""Run Quirkt demos for the Railway API."""

from __future__ import annotations

from typing import Any

from quirkt.export import build_playground_payload
from quirkt.oracle import QuantumRandomOracle
from quirkt.portfolio import PortfolioSampler
from quirkt.swap_search import SwapRouteGrover


def run_demo(
    demo_id: str,
    *,
    shots: int = 2048,
    seed: int | None = None,
    qubits: int = 4,
    marked_index: int = 5,
    risk_penalty: float = 0.35,
) -> dict[str, Any]:
    if demo_id == "oracle":
        result = QuantumRandomOracle(qubits=qubits, seed=seed).run(shots=shots)
        return {
            "demo": demo_id,
            "engine": "qiskit-aer",
            "shots": shots,
            "seed": seed,
            "bits": result.bits,
            "counts": result.counts,
        }

    if demo_id == "portfolio":
        sampler = PortfolioSampler(risk_penalty=risk_penalty, seed=seed)
        result = sampler.run(shots=shots)
        return {
            "demo": demo_id,
            "engine": "qiskit-aer",
            "shots": shots,
            "seed": seed,
            "labels": result.labels,
            "weights": result.weights,
            "expectation": result.expectation,
            "counts": result.counts,
        }

    if demo_id == "grover":
        grover = SwapRouteGrover(marked_index=marked_index, seed=seed)
        result = grover.run(shots=shots)
        return {
            "demo": demo_id,
            "engine": "qiskit-aer",
            "shots": shots,
            "seed": seed,
            "marked_index": result.marked_index,
            "marked_route": result.marked_route,
            "routes": result.routes,
            "success_probability": result.success_probability,
            "counts": result.counts,
        }

    raise ValueError(f"Unknown demo: {demo_id}")


def playground_payload(seed: int = 42, shots: int = 2048) -> dict[str, Any]:
    payload = build_playground_payload(seed=seed)
    payload["shots_default"] = shots
    payload["engine"] = "qiskit-aer"
    return payload
