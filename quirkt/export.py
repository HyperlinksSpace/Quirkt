"""Export Qiskit playground specifications for the static GitHub Pages demo."""

from __future__ import annotations

import json
from pathlib import Path

from quirkt.oracle import QuantumRandomOracle
from quirkt.portfolio import PortfolioSampler
from quirkt.swap_search import SwapRouteGrover


def build_playground_payload(seed: int = 42) -> dict:
    demos = [
        QuantumRandomOracle(qubits=4, seed=seed).to_playground_spec(),
        PortfolioSampler(seed=seed).to_playground_spec(),
        SwapRouteGrover(marked_index=5, seed=seed).to_playground_spec(),
    ]
    return {
        "version": "0.1.0",
        "project": "Quirkt",
        "hsp_program": "HyperlinksSpaceProgram",
        "generated_by": "qiskit",
        "seed": seed,
        "demos": demos,
    }


def write_playground_data(output: Path, seed: int = 42) -> Path:
    output.parent.mkdir(parents=True, exist_ok=True)
    payload = build_playground_payload(seed=seed)
    output.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return output
