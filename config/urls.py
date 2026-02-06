"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('taches/', include('taches.urls')),
    path('api-auth/', include('rest_framework.urls')),
    # Endpoint pour obtenir un token (POST: username, password)
    path('api/token/', obtain_auth_token),
]


def serve_react_index(request, _path=''):
    """Serve the built React app's index.html for non-API routes."""
    index_file = settings.BASE_DIR / 'frontend' / 'dist' / 'index.html'
    try:
        return FileResponse(open(index_file, 'rb'))
    except FileNotFoundError:
        raise Http404('React build index.html not found. Run npm run build in frontend.')


# Catch-all: if the URL doesn't start with api/ or taches/, serve the React app.
urlpatterns += [
    re_path(r'^(?!api/|taches/).*$', serve_react_index),
]
