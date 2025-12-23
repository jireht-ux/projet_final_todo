from django.urls import path
from . import views

app_name = "taches"

# Routes CRUD pour l'application `taches`.
urlpatterns = [
    # Liste des tâches
    path('', views.tache_list, name='list'),
    # Créer une tâche
    path('create/', views.tache_create, name='create'),
    # Détail d'une tâche
    path('<int:pk>/', views.tache_detail, name='detail'),
    # Mettre à jour une tâche
    path('<int:pk>/update/', views.tache_update, name='update'),
    # Supprimer une tâche
    path('<int:pk>/delete/', views.tache_delete, name='delete'),
    # API: liste des tâches (DRF)
    path('api/liste/', views.liste_taches_api, name='api-liste'),
    # API: détail d'une tâche (GET, PUT, DELETE)
    path('api/<int:pk>/', views.detail_tache_api, name='api-detail'),
]
