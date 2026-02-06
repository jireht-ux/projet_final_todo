"""Package initializer for moved monprojet inside `config`.

Import the Celery app so Django (the `config` package) loads it
on startup when `config` is imported.
"""

from .celery import app as celery_app  # noqa

__all__ = ("celery_app",)
