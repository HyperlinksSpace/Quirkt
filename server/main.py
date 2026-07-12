"""Quirkt Qiskit API — deploy on Railway, consume from GitHub Pages."""

from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from server.runners import playground_payload, run_demo

DemoId = Literal["oracle", "portfolio", "grover"]


def _allowed_origins() -> list[str]:
    raw = os.getenv("QUIRKT_ALLOWED_ORIGINS", "")
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    if origins:
        return origins
    return [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8000",
    ]


def _github_pages_regex() -> str | None:
    flag = os.getenv("QUIRKT_ALLOW_GITHUB_PAGES", "true").lower()
    if flag in ("0", "false", "no"):
        return None
    return r"https://([\w-]+\.)?github\.io"


app = FastAPI(
    title="Quirkt API",
    description="Live Qiskit Aer backend for the Quirkt GitHub Pages playground.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_origin_regex=_github_pages_regex(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class RunRequest(BaseModel):
    demo: DemoId
    shots: int = Field(default=2048, ge=128, le=8192)
    seed: int | None = None
    qubits: int = Field(default=4, ge=1, le=12)
    marked_index: int = Field(default=5, ge=0, le=7)
    risk_penalty: float = Field(default=0.35, ge=0.0, le=1.0)


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "quirkt-api",
        "engine": "qiskit-aer",
        "allowed_origins": _allowed_origins(),
        "github_pages_regex": _github_pages_regex(),
    }


@app.get("/api/playground")
def get_playground(
    seed: int = Query(default=42),
    shots: int = Query(default=2048, ge=128, le=8192),
) -> dict:
    return playground_payload(seed=seed, shots=shots)


@app.post("/api/run")
def post_run(body: RunRequest) -> dict:
    try:
        return run_demo(
            body.demo,
            shots=body.shots,
            seed=body.seed,
            qubits=body.qubits,
            marked_index=body.marked_index,
            risk_penalty=body.risk_penalty,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/run/{demo_id}")
def get_run(
    demo_id: DemoId,
    shots: int = Query(default=2048, ge=128, le=8192),
    seed: int | None = Query(default=None),
    qubits: int = Query(default=4, ge=1, le=12),
    marked_index: int = Query(default=5, ge=0, le=7),
    risk_penalty: float = Query(default=0.35, ge=0.0, le=1.0),
) -> dict:
    try:
        return run_demo(
            demo_id,
            shots=shots,
            seed=seed,
            qubits=qubits,
            marked_index=marked_index,
            risk_penalty=risk_penalty,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
