from django.test import TestCase
from django.urls import reverse

from .models import Tache


class TacheViewsTests(TestCase):
	def test_tache_list_status_code(self):
		"""La page de liste doit répondre avec un code 200."""
		url = reverse('taches:list')
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, 200)

	def test_create_tache_via_post(self):
		"""Poster des données valides doit créer une Tache et rediriger vers la liste."""
		url = reverse('taches:create')
		data = {
			'titre': 'Test créer',
			'description': 'Description de test',
			'termine': False,
		}
		resp = self.client.post(url, data)

		# Doit rediriger (status 302) vers la liste
		self.assertIn(resp.status_code, (302,))

		# La tâche doit exister en base
		t = Tache.objects.filter(titre='Test créer').first()
		self.assertIsNotNone(t)
		self.assertEqual(t.description, 'Description de test')
