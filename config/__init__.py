"""Config package initializer.

Import the Celery application exposed by `config.monprojet` so Celery
is loaded when Django imports the `config` package at startup.
"""

from .monprojet import celery_app  # noqa

__all__ = ("celery_app",)
