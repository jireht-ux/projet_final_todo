"""Tâches Celery pour l'app `taches`.

Contient une tâche de test simple utilisée pour vérifier l'exécution asynchrone.
"""

import time
from celery import shared_task
from django.core.mail import send_mail
from .models import Tache


@shared_task
def tache_test_asynchrone():
    """Attends 5 secondes puis affiche un message indiquant la fin."""
    time.sleep(5)
    print("Tâche asynchrone terminée avec succès !")


@shared_task(autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 10})
def send_creation_email(tache_id):
    """Envoie un e-mail (vers admin@example.com) lorsque une tâche est créée.

    Arguments:
        tache_id (int): Identifiant de la `Tache` à envoyer.
    """
    try:
        tache = Tache.objects.get(pk=tache_id)
    except Tache.DoesNotExist:
        return f"Tache {tache_id} introuvable."

    subject = f"Nouvelle tâche créée : {tache.titre}"
    message = (
        f"Titre: {tache.titre}\n"
        f"Description: {tache.description or '(aucune)'}\n"
        f"Créée le: {tache.cree_le}\n"
    )
    from_email = 'no-reply@example.com'
    recipient_list = ['admin@example.com']

    # Send the email normally in development (console backend)
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    return f"E-mail envoyé pour la tâche {tache_id}."


@shared_task
def generate_task_report():
    """Simule un long traitement et retourne un message de succès."""
    time.sleep(15)
    return "Le rapport de tâches a été généré avec succès !"


@shared_task
def cleanup_completed_tasks():
    """Supprime toutes les `Tache` marquées comme `termine=True`.

    Retourne le nombre de tâches supprimées.
    """
    qs = Tache.objects.filter(termine=True)
    # queryset.delete() retourne un tuple (n_deleted, {<model>: n, ...})
    deleted_count, _ = qs.delete()
    return deleted_count
