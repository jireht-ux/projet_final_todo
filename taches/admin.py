from django.contrib import admin
from .models import Tache, Commentaire


@admin.register(Tache)
class TacheAdmin(admin.ModelAdmin):
	list_display = ("titre", "termine", "cree_le")
	list_filter = ("termine",)
	search_fields = ("titre", "description")


@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display = ("tache", "user", "cree_le")
    search_fields = ("contenu",)

