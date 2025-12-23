
from django.shortcuts import render, get_object_or_404, redirect

from .models import Tache
from .forms import TacheForm
from .serializers import TacheSerializer

# Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics


def tache_list(request):
	"""Affiche la liste de toutes les tâches, ordonnées par date de création (desc)."""
	taches = Tache.objects.all().order_by('-cree_le')
	return render(request, 'taches/tache_liste.html', {'taches': taches})


def tache_create(request):
	"""Créer une nouvelle tâche via un ModelForm. Après création, redirige vers la liste."""
	if request.method == 'POST':
		form = TacheForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect('taches:list')
	else:
		form = TacheForm()

	return render(request, 'taches/tache_form.html', {'form': form})


def tache_update(request, pk):
	"""Modifier une tâche existante en réutilisant `TacheForm` et `tache_form.html`.

	- GET : affiche le formulaire pré-rempli
	- POST : valide et sauvegarde, puis redirige vers la liste
	"""
	tache = get_object_or_404(Tache, pk=pk)
	if request.method == 'POST':
		form = TacheForm(request.POST, instance=tache)
		if form.is_valid():
			form.save()
			return redirect('taches:list')
	else:
		form = TacheForm(instance=tache)

	return render(request, 'taches/tache_form.html', {'form': form, 'tache': tache})


def tache_delete(request, pk):
	"""Confirmer et supprimer une tâche.

	- GET : affiche la page de confirmation
	- POST : supprime l'objet et redirige vers la liste
	"""
	tache = get_object_or_404(Tache, pk=pk)
	if request.method == 'POST':
		tache.delete()
		return redirect('taches:list')

	return render(request, 'taches/tache_confirm_delete.html', {'tache': tache})


def tache_detail(request, pk):
	"""Afficher le détail d'une tâche identifiée par sa clé primaire."""
	tache = get_object_or_404(Tache, pk=pk)
	return render(request, 'taches/tache_detail.html', {'tache': tache})



# ViewSet DRF pour toutes les opérations CRUD sur Tache
from rest_framework.viewsets import ModelViewSet


class TacheViewSet(ModelViewSet):
	serializer_class = TacheSerializer

	def get_queryset(self):
		# Retourne uniquement les tâches dont le propriétaire est l'utilisateur connecté
		return Tache.objects.filter(owner=self.request.user).order_by('-cree_le')

	def perform_create(self, serializer):
		# Associe l'utilisateur connecté comme propriétaire lors de la création
		serializer.save(owner=self.request.user)

