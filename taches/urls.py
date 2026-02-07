
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "taches"


# Router DRF pour l'API
router = DefaultRouter()
router.register(r'taches', views.TacheViewSet, basename='tache')

urlpatterns = [
    # Routes web classiques
    path('', views.tache_list, name='list'),
    path('create/', views.tache_create, name='create'),
    path('<int:pk>/', views.tache_detail, name='detail'),
    path('<int:pk>/update/', views.tache_update, name='update'),
    path('<int:pk>/delete/', views.tache_delete, name='delete'),

    # Routes API générées par le routeur
    path('api/', include(router.urls)),
    path('start-report/', views.StartReportGenerationView.as_view(), name='start-report'),
    path('check-report-status/<str:task_id>/', views.CheckTaskStatusView.as_view(), name='check-report-status'),
    # Route de test pour Celery
    path('test-celery/', views.TestCeleryView, name='test-celery'),
]
