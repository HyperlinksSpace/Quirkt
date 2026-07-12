from quirkt.oracle import QuantumRandomOracle
from quirkt.portfolio import PortfolioSampler
from quirkt.swap_search import SwapRouteGrover


def test_oracle_returns_bitstring():
    result = QuantumRandomOracle(qubits=3, seed=1).run(shots=256)
    assert len(result.bits) == 3
    assert sum(result.counts.values()) == 256


def test_portfolio_weights_sum_to_one():
    result = PortfolioSampler(seed=2).run(shots=512)
    assert len(result.weights) == 4
    assert abs(sum(result.weights) - 1.0) < 1e-6


def test_grover_finds_marked_route():
    grover = SwapRouteGrover(marked_index=3, seed=3)
    result = grover.run(shots=4096)
    assert result.marked_route == grover.routes[3]
    assert result.success_probability > 0.5
