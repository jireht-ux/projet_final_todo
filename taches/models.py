from django.db import models



from django.conf import settings

class Tache(models.Model):
	titre = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	cree_le = models.DateTimeField(auto_now_add=True)
	termine = models.BooleanField(default=False)
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
