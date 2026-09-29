import time
import threading
from typing import Dict, Tuple, Optional, Any
from fastapi import Request, HTTPException, status

class TokenBucketRateLimiter:
    """
    Token Bucket Rate Limiter for API Gateway & Endpoint Throttling.
    Protects expensive AI/LLM endpoints from rate quota exhaustion and denial-of-service.
    """
    def __init__(self, capacity: int = 20, refill_rate: float = 0.5):
        """
        :param capacity: Maximum burst token capacity (e.g. 20 requests)
        :param refill_rate: Tokens added per second (e.g. 0.5 = 30 requests per minute)
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        # ip -> (tokens, last_refreshed_timestamp)
        self.buckets: Dict[str, Tuple[float, float]] = {}
        self.lock = threading.Lock()
        self.throttled_count = 0
        self.total_checked = 0

    def is_allowed(self, client_ip: str) -> Tuple[bool, float]:
        """
        Checks if client IP has available tokens.
        Returns: (is_allowed, retry_after_seconds)
        """
        now = time.time()
        with self.lock:
            self.total_checked += 1
            tokens, last_time = self.buckets.get(client_ip, (float(self.capacity), now))
            
            # Refill tokens based on elapsed time
            elapsed = now - last_time
            tokens = min(float(self.capacity), tokens + (elapsed * self.refill_rate))

            if tokens >= 1.0:
                self.buckets[client_ip] = (tokens - 1.0, now)
                return True, 0.0
            else:
                self.buckets[client_ip] = (tokens, now)
                self.throttled_count += 1
                needed = 1.0 - tokens
                retry_after = round(needed / self.refill_rate, 1)
                return False, max(1.0, retry_after)

    def get_stats(self) -> Dict[str, Any]:
        with self.lock:
            return {
                "capacity": self.capacity,
                "refill_rate_per_sec": self.refill_rate,
                "active_client_ips": len(self.buckets),
                "total_checked": self.total_checked,
                "throttled_requests": self.throttled_count
            }

# Global rate limiter instance: 20 burst tokens, 0.5/s refill (30 reqs/min)
chat_rate_limiter = TokenBucketRateLimiter(capacity=20, refill_rate=0.5)

def check_rate_limit(request: Request):
    """FastAPI dependency to enforce rate limits per client IP."""
    # Read forwarded IP if behind proxy (Railway / Vercel)
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "127.0.0.1"

    allowed, retry_after = chat_rate_limiter.is_allowed(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Please slow down and try again in {retry_after} seconds.",
            headers={"Retry-After": str(int(retry_after))}
        )
