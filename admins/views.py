from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import Recipe, Ingredient
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse
import json

# Create your views here.

@require_http_methods(["GET"])
def view_recipes(request):
    # Logic to fetch and display recipes
    return render(request, 'view_recipes.html', {'recipes': Recipe.objects.all()})

@require_http_methods(["GET"])
def manage_recipe(request):
    return render(request, 'manage_recipe.html')

@csrf_exempt
@require_http_methods(["POST"])
def add_recipe(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        course = data.get('course')
        rate = data.get('rate')
        duration = data.get('duration')
        description = data.get('description')
        instructions = data.get('instructions')
        recipeImage = data.get('recipe_image')


        recipe = Recipe(
            name=name,
            course=course,
            rate=rate,
            duration=duration,
            description=description,
            instructions=instructions,
            image=recipeImage
        )
        recipe.save()

        ingredients = data.get('ingredients', [])
        for ing in ingredients:
            Ingredient.objects.create(
                recipe=recipe,
                name=ing.get('name'),
                quantity=ing.get('quantity')
            )
        # Save the recipe instance to the database


        
            
        return JsonResponse({
            'success': True, 
            'message': 'Add Recipe successful!'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during adding recipe: {e}'})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.delete()
        return JsonResponse({'success': True, 'message': 'Recipe deleted successfully!'})
    except Recipe.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Recipe not found!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during deleting recipe: {e}'})