"""Tâches Celery pour l'app `taches`.

Contient une tâche de test simple utilisée pour vérifier l'exécution asynchrone.
"""

import time
from celery import shared_task


@shared_task
def tache_test_asynchrone():
    """Attends 5 secondes puis affiche un message indiquant la fin."""
    time.sleep(5)
    print("Tâche asynchrone terminée avec succès !")
