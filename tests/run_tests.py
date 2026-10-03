"""
Test runner script for BIS SmartAssist RAG pipeline tests.
Executes all test functions and reports assertions and timings.
"""

import sys
import types
import time
import importlib.util
import traceback
from pathlib import Path

# If pytest is not installed in the environment, provide a minimal compatible stub
if "pytest" not in sys.modules:
    try:
        import pytest
    except ImportError:
        stub = types.ModuleType("pytest")
        
        class Mark:
            @staticmethod
            def parametrize(names, values):
                def decorator(func):
                    if not hasattr(func, "pytestmark"):
                        func.pytestmark = []
                    
                    class MockMark:
                        name = "parametrize"
                        args = (names, values)
                    func.pytestmark.append(MockMark())
                    return func
                return decorator

        stub.mark = Mark()
        stub.fixture = lambda *args, **kwargs: (lambda f: f)
        sys.modules["pytest"] = stub

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))


def load_module_from_file(file_path: Path):
    spec = importlib.util.spec_from_file_location(file_path.stem, str(file_path))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run_all_tests():
    test_files = [
        root_dir / "tests" / "test_cleaning.py",
        root_dir / "tests" / "test_dataset.py",
        root_dir / "tests" / "test_retrieval.py",
        root_dir / "tests" / "test_rag_pipeline.py",
    ]

    total = 0
    passed = 0
    failed = 0
    errors = []

    print("=" * 60)
    print("RUNNING BIS TEST SUITE")
    print("=" * 60)

    start_time = time.time()

    for file_path in test_files:
        if not file_path.exists():
            continue
        mod_name = file_path.stem
        try:
            mod = load_module_from_file(file_path)
        except Exception as e:
            print(f"[ERROR LOADING {mod_name}]: {e}")
            errors.append((mod_name, traceback.format_exc()))
            continue

        print(f"\n--- Module: {mod_name} ---")
        for attr_name in sorted(dir(mod)):
            if attr_name.startswith("test_") and callable(getattr(mod, attr_name)):
                test_func = getattr(mod, attr_name)
                # Check if it has pytest mark parametrize
                if hasattr(test_func, "pytestmark"):
                    marks = test_func.pytestmark
                    for mark in marks:
                        if mark.name == "parametrize":
                            arg_names = [a.strip() for a in mark.args[0].split(",")]
                            arg_values = mark.args[1]
                            for val in arg_values:
                                total += 1
                                t0 = time.time()
                                try:
                                    if len(arg_names) == 1:
                                        test_func(val)
                                    else:
                                        test_func(*val)
                                    dt = (time.time() - t0) * 1000
                                    print(f"  [PASS] {attr_name}({val}) ({dt:.1f}ms)")
                                    passed += 1
                                except Exception as e:
                                    dt = (time.time() - t0) * 1000
                                    print(f"  [FAIL] {attr_name}({val}) ({dt:.1f}ms): {e}")
                                    failed += 1
                                    errors.append((f"{mod_name}.{attr_name}({val})", traceback.format_exc()))
                            break
                else:
                    total += 1
                    t0 = time.time()
                    try:
                        test_func()
                        dt = (time.time() - t0) * 1000
                        print(f"  [PASS] {attr_name} ({dt:.1f}ms)")
                        passed += 1
                    except Exception as e:
                        dt = (time.time() - t0) * 1000
                        print(f"  [FAIL] {attr_name} ({dt:.1f}ms): {e}")
                        failed += 1
                        errors.append((f"{mod_name}.{attr_name}", traceback.format_exc()))

    total_time = (time.time() - start_time) * 1000
    print("\n" + "=" * 60)
    print(f"TEST SUMMARY: {passed}/{total} Passed, {failed} Failed in {total_time:.1f}ms")
    print("=" * 60)

    if errors:
        print("\nFAILURES:")
        for name, tb in errors:
            print(f"\n[{name}]:\n{tb}")
        sys.exit(1)
    else:
        print("\nALL TESTS PASSED SUCCESSFULLY!")
        sys.exit(0)


if __name__ == "__main__":
    run_all_tests()
