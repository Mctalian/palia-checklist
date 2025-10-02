import os
from typing import Any, Dict


def is_dry_run() -> bool:
    """Check if DO_WEEKLY_RESET environment variable is NOT set to 'true'"""
    return os.getenv("DO_WEEKLY_RESET", "").lower() != "true"


def get_wiki_config() -> Dict[str, Any]:
    """Get wiki configuration from environment variables"""
    return {
        "username": os.getenv("WIKI_USERNAME", ""),
        "password": os.getenv("WIKI_PASSWORD", ""),
    }
