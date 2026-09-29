import time
import logging
from enum import Enum
from typing import Callable, Any, Dict
import threading

logger = logging.getLogger(__name__)

class CircuitState(str, Enum):
    CLOSED = "CLOSED"       # Normal operation: external API calls allowed
    OPEN = "OPEN"           # Tripped: fast-fail to local deterministic fallback
    HALF_OPEN = "HALF_OPEN" # Testing recovery: single trial call permitted

class CircuitBreaker:
    """
    Circuit Breaker pattern for external LLM calls (Gemini / OpenAI):
    Prevents thread exhaustion, latency degradation, and API cascading failures.
    Automatically degrades gracefully to local deterministic RAG synthesis when tripped.
    """
    def __init__(
        self,
        name: str = "LLM-Gateway",
        failure_threshold: int = 3,
        recovery_timeout: float = 30.0,
        success_threshold: int = 2
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.success_threshold = success_threshold
        self.lock = threading.Lock()

        self.state = CircuitState.CLOSED
        self.consecutive_failures = 0
        self.consecutive_successes = 0
        self.last_failure_time = 0.0
        self.last_failure_reason = ""
        self.total_tripped_count = 0
        self.total_calls = 0
        self.total_degraded_calls = 0

    def can_execute(self) -> bool:
        """Determines if external call should proceed or fast-fail."""
        with self.lock:
            now = time.time()
            if self.state == CircuitState.OPEN:
                if now - self.last_failure_time >= self.recovery_timeout:
                    self.state = CircuitState.HALF_OPEN
                    logger.info(f"[CircuitBreaker:{self.name}] Transitioned to HALF_OPEN (probing external service)")
                    return True
                return False
            return True

    def record_success(self):
        """Records a successful external API call."""
        with self.lock:
            self.total_calls += 1
            if self.state == CircuitState.HALF_OPEN:
                self.consecutive_successes += 1
                if self.consecutive_successes >= self.success_threshold:
                    self.state = CircuitState.CLOSED
                    self.consecutive_failures = 0
                    self.consecutive_successes = 0
                    logger.info(f"[CircuitBreaker:{self.name}] Service recovered! Transitioned to CLOSED")
            elif self.state == CircuitState.CLOSED:
                self.consecutive_failures = 0

    def record_failure(self, error: Exception):
        """Records a failed external API call and trips breaker if threshold exceeded."""
        with self.lock:
            self.total_calls += 1
            self.consecutive_failures += 1
            self.consecutive_successes = 0
            self.last_failure_time = time.time()
            self.last_failure_reason = str(error)

            if self.state in [CircuitState.CLOSED, CircuitState.HALF_OPEN]:
                if self.consecutive_failures >= self.failure_threshold or self.state == CircuitState.HALF_OPEN:
                    self.state = CircuitState.OPEN
                    self.total_tripped_count += 1
                    logger.warning(
                        f"[CircuitBreaker:{self.name}] TRIPPED to OPEN! Failures: {self.consecutive_failures}. "
                        f"Reason: {error}. Degrading to local deterministic RAG for {self.recovery_timeout}s."
                    )

    def record_fallback(self):
        """Records when a call was degraded to local deterministic fallback."""
        with self.lock:
            self.total_degraded_calls += 1

    def get_status(self) -> Dict[str, Any]:
        """Telemetry export for system design dashboard."""
        with self.lock:
            now = time.time()
            time_until_probe = 0.0
            if self.state == CircuitState.OPEN:
                elapsed = now - self.last_failure_time
                time_until_probe = max(0.0, round(self.recovery_timeout - elapsed, 1))

            return {
                "name": self.name,
                "state": self.state.value,
                "consecutive_failures": self.consecutive_failures,
                "consecutive_successes": self.consecutive_successes,
                "total_calls": self.total_calls,
                "total_degraded_calls": self.total_degraded_calls,
                "total_tripped_count": self.total_tripped_count,
                "seconds_until_recovery_probe": time_until_probe,
                "last_failure_reason": self.last_failure_reason or None
            }

# Global singleton instance for external LLMs
llm_circuit_breaker = CircuitBreaker(name="Gemini-LLM-Breaker", failure_threshold=3, recovery_timeout=30.0)
