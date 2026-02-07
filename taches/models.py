from django.db import models



from django.conf import settings

class Tache(models.Model):
	titre = models.CharField(max_length=200, db_index=True)
	description = models.TextField(blank=True)
	cree_le = models.DateTimeField(auto_now_add=True)
	termine = models.BooleanField(default=False)
	priorite = models.IntegerField(default=0)
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='taches',
		verbose_name='propriétaire'
	)

	class Meta:
		verbose_name = "tâche"
		verbose_name_plural = "tâches"
		ordering = ["-cree_le"]

	def __str__(self) -> str:
		return f"{self.titre} ({'✓' if self.termine else '✗'})"


class Commentaire(models.Model):
	"""Commentaires attachés à une `Tache`.

	Chaque commentaire référence la tâche et l'utilisateur auteur.
	"""
	tache = models.ForeignKey(
		Tache,
		on_delete=models.CASCADE,
		related_name='commentaires'
	)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	contenu = models.TextField()
	cree_le = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = 'commentaire'
		verbose_name_plural = 'commentaires'
		ordering = ['-cree_le']

	def __str__(self) -> str:
		return f"Commentaire de {self.user} sur {self.tache}: {self.contenu[:30]}"
