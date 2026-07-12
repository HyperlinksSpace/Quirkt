#!/usr/bin/env python3
"""Generate assets/data/playground.json from Qiskit reference runs."""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from quirkt.export import write_playground_data  # noqa: E402


def main() -> None:
    output = ROOT / "assets" / "data" / "playground.json"
    path = write_playground_data(output, seed=42)
    print(f"Wrote {path}")


if __name__ == "__main__":
    main()
