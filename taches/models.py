from django.db import models


class Tache(models.Model):
	titre = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	cree_le = models.DateTimeField(auto_now_add=True)
	termine = models.BooleanField(default=False)

	class Meta:
		verbose_name = "tâche"
		verbose_name_plural = "tâches"
		ordering = ["-cree_le"]

	def __str__(self) -> str:
		return f"{self.titre} ({'✓' if self.termine else '✗'})"
