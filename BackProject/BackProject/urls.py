"""
URL configuration for BackProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from BackApp import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/roles', views.api_roles),
    path('api/continents', views.api_continents),

    path('api/players/<int:player_id>/', views.player_details),
    path('api/players/create', views.create_player),
    path('api/players/update/<int:pk>', views.update_player),
    path('api/players', views.api_players),
    path('api/players/delete/<int:pk>', views.delete_player),

    path('api/teams/<int:team_id>/', views.team_details),
    path('api/teams', views.api_teams),
    path('team/<int:team_id>/players', views.team_players),
    path('api/teams/create', views.create_team),
    path('api/teams/update/<int:pk>', views.update_team),    
    path('api/teams/delete/<int:pk>', views.delete_team),

    path('api/home', views.home),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
