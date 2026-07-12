#!/usr/bin/env python3
"""Run all Quirkt Qiskit demos locally."""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from quirkt.export import build_playground_payload  # noqa: E402
from quirkt.oracle import QuantumRandomOracle  # noqa: E402
from quirkt.portfolio import PortfolioSampler  # noqa: E402
from quirkt.swap_search import SwapRouteGrover  # noqa: E402


def main() -> None:
    seed = 42
    oracle = QuantumRandomOracle(qubits=4, seed=seed).run()
    portfolio = PortfolioSampler(seed=seed).run()
    grover = SwapRouteGrover(marked_index=5, seed=seed).run()

    print("=== Quirkt local Qiskit demo ===\n")
    print(f"Oracle top bits: {oracle.bits}  (shots={oracle.shots})")
    print(f"Portfolio weights: {dict(zip(portfolio.labels, portfolio.weights))}")
    print(f"Grover marked route: {grover.marked_route}  P~{grover.success_probability:.3f}")
    print(f"\nPlayground payload: {len(build_playground_payload(seed)['demos'])} demos ready")


if __name__ == "__main__":
    main()
