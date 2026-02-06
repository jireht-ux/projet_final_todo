from __future__ import annotations

import os
from celery import Celery
from django.conf import settings

# Set default Django settings module for 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

# Configure Celery to read settings from Django settings, using the
# `CELERY_` namespace (e.g. `CELERY_BROKER_URL`).
app.config_from_object('django.conf:settings', namespace='CELERY')


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Optional: place to add periodic tasks programmatically if needed.
    return None


# Autodiscover tasks from all installed apps. By default Celery looks for a
# module named `tasks.py` inside each app, which matches the standard
# convention and your existing `taches/tasks.py` file.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


if __name__ == '__main__':
    # For `celery -A config worker -l info` entrypoint support
    app.start()
