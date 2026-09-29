import time
import uuid
import threading
from typing import Dict, Any, Optional, Callable
from concurrent.futures import ThreadPoolExecutor

class TaskStatus:
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class AsyncTaskQueue:
    """
    Decoupled Asynchronous Worker Queue for heavy ingestion & background processing.
    Allows HTTP upload endpoints to instantly return 202 Accepted + Task ID
    while processing chunking, OCR, and vectorization asynchronously.
    """
    def __init__(self, max_workers: int = 2):
        self.executor = ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="bis-worker")
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()

    def submit_task(self, task_type: str, fn: Callable, *args, **kwargs) -> str:
        task_id = f"task_{uuid.uuid4().hex[:12]}"
        now = time.time()
        
        with self.lock:
            self.tasks[task_id] = {
                "task_id": task_id,
                "task_type": task_type,
                "status": TaskStatus.QUEUED,
                "progress_percent": 0,
                "created_at": now,
                "started_at": None,
                "completed_at": None,
                "result": None,
                "error": None
            }

        def _runner():
            with self.lock:
                self.tasks[task_id]["status"] = TaskStatus.PROCESSING
                self.tasks[task_id]["started_at"] = time.time()
                self.tasks[task_id]["progress_percent"] = 15

            def progress_callback(pct: int):
                with self.lock:
                    if task_id in self.tasks:
                        self.tasks[task_id]["progress_percent"] = min(99, max(0, pct))

            try:
                # Execute worker function
                res = fn(progress_callback=progress_callback, *args, **kwargs)
                with self.lock:
                    self.tasks[task_id]["status"] = TaskStatus.COMPLETED
                    self.tasks[task_id]["progress_percent"] = 100
                    self.tasks[task_id]["completed_at"] = time.time()
                    self.tasks[task_id]["result"] = res
            except Exception as e:
                with self.lock:
                    self.tasks[task_id]["status"] = TaskStatus.FAILED
                    self.tasks[task_id]["completed_at"] = time.time()
                    self.tasks[task_id]["error"] = str(e)

        self.executor.submit(_runner)
        return task_id

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            task = self.tasks.get(task_id)
            if not task:
                return None
            copy = dict(task)
            if copy.get("started_at") and copy.get("completed_at"):
                copy["duration_seconds"] = round(copy["completed_at"] - copy["started_at"], 2)
            elif copy.get("started_at"):
                copy["duration_seconds"] = round(time.time() - copy["started_at"], 2)
            return copy

    def list_tasks(self, limit: int = 20) -> list[Dict[str, Any]]:
        with self.lock:
            sorted_tasks = sorted(self.tasks.values(), key=lambda x: x["created_at"], reverse=True)
            return sorted_tasks[:limit]

# Global singleton worker queue
async_task_queue = AsyncTaskQueue(max_workers=2)
