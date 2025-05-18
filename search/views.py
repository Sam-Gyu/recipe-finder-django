from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from admins.models import Recipe
from favourites.models import Favorite
import json

@login_required
def search_recipes(request):
    recipes = Recipe.objects.all()
    favorites = Favorite.objects.filter(user=request.user)
    recipes_json = json.dumps([
        {
            'id': r.id,
            'name': r.name,
            'course': r.course,
            'description': r.description,
            'instructions': r.instructions,
            'duration': r.duration,
            'rate': r.rate,
            'image': r.image.url if r.image else '',
        } for r in recipes
    ])

    favorites_json = json.dumps([
        {
            'user': f.user.id,
            'recipe': f.recipe.id,
        } for f in favorites
    ])

    context = {
        'recipes_json': recipes_json,
        'favorites_json': favorites_json
    }
    return render(request, 'search.html', context)

@login_required
def view_recipe(request,recipeId):
    recipe = Recipe.objects.get(id=recipeId)
    f = Favorite.objects.filter(user=request.user, recipe=recipe)
    if(f):
        favorite = json.dumps([{'status': True}])
    else:
        favorite = json.dumps([{'status': False}])
    
    return render(request, 'view.html',{ 'recipe': recipe,'favorite': favorite, 'rate': "★" * recipe.rate})














