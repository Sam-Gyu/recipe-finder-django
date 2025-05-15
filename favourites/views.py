# views.py
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from .models import Favorite
from admins.models import Recipe
import json

@login_required
def favorites_page(request):
    return render(request, 'favourites.html')

@require_POST
@login_required
def add_to_favorites(request):
    data = json.loads(request.body)
    recipe_id = data.get('recipe_id')
    recipe = Recipe.objects.get(id=recipe_id)
    Favorite.objects.get_or_create(user=request.user, recipe=recipe)
    return JsonResponse({'status': 'added'})

@require_POST
@login_required
def remove_from_favorites(request):
    data = json.loads(request.body)
    recipe_id = data.get('recipe_id')
    Favorite.objects.filter(user=request.user, recipe_id=recipe_id).delete()
    return JsonResponse({'status': 'removed'})

@require_GET
@login_required
def get_favorites(request):
    favorites = Favorite.objects.filter(user=request.user).select_related('recipe')
    data = [{
        'id': fav.recipe.id,
        'name': fav.recipe.name,
        'course': fav.recipe.course,
        'description': fav.recipe.description,
        'instructions': fav.recipe.instructions,
        'duration': fav.recipe.duration,
        'rate': fav.recipe.rate,
        'image': fav.recipe.image,
    } for fav in favorites]
    return JsonResponse({'favorites': data})
