from django.urls import path
from . import views

urlpatterns = [
    path('', views.favorites_page, name= 'favorites_page' ),
    path('api/favorites/', views.get_favorites, name='get_favorites'),
    path('api/favorites/add/', views.add_to_favorites, name='add_to_favorites'),
    path('api/favorites/remove/', views.remove_from_favorites, name='remove_from_favorites'),
]

