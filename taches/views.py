
from django.shortcuts import render, get_object_or_404, redirect

from .models import Tache
from .forms import TacheForm
from .serializers import TacheSerializer

# Django REST Framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


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


@api_view(['GET', 'POST'])
def liste_taches_api(request):
	"""API endpoint: GET retourne la liste des tâches sérialisées.

	POST permet de créer une nouvelle tâche en envoyant les données JSON.
	- Si valide -> renvoie 201 Created avec la ressource créée
	- Si invalide -> renvoie 400 avec les erreurs
	"""
	if request.method == 'GET':
		taches = Tache.objects.all().order_by('-cree_le')
		serializer = TacheSerializer(taches, many=True)
		return Response(serializer.data)

	# POST
	serializer = TacheSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def detail_tache_api(request, pk):
	"""API endpoint pour une tâche unique.

	- GET : retourne la tâche sérialisée
	- PUT : met à jour la tâche (données validées via TacheSerializer)
	- DELETE : supprime la tâche
	"""
	tache = get_object_or_404(Tache, pk=pk)

	if request.method == 'GET':
		serializer = TacheSerializer(tache)
		return Response(serializer.data)

	if request.method == 'PUT':
		serializer = TacheSerializer(tache, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	if request.method == 'DELETE':
		tache.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

