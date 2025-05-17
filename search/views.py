from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Recipe
import json

@login_required
def search_recipes(request):
    recipes = Recipe.objects.filter(user=request.user)
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
    
    context = {
        'recipes_json': recipes_json,
    }
    return render(request, 'search.html', context)
