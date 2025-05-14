from django.urls import path, include
from .views import view_recipes, manage_recipe, add_recipe, delete_recipe

urlpatterns = [
    path('view-recipes/', view_recipes, name='view_recipes'),
    path('manage-recipe/', manage_recipe, name='manage_recipe'),
    path('manage-recipe/add-recipe/', add_recipe, name='add_recipe'),
    path('view-recipes/delete-recipe/<int:recipe_id>', delete_recipe, name='delete_recipe'),
]