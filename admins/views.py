from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import Recipe, Ingredient
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse
import json
import base64
import uuid
from django.core.files.base import ContentFile
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
        format, imgstr = recipeImage.split(';base64,') 
        ext = format.split('/')[-1]  

        filename = f"{uuid.uuid4()}.{ext}"

        image_file = ContentFile(base64.b64decode(imgstr), name=filename)

        recipe = Recipe(
            name=name,
            course=course,
            rate=rate,
            duration=duration,
            description=description,
            instructions=instructions,
            image=image_file
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

@require_http_methods(["GET"])
def show_recipe(request, recipe_id):
    try:
        redirect_url = reverse('display_recipe', args=[recipe_id])
            
        return JsonResponse({
            'success': True, 
            'redirect_url': redirect_url
        })
    except Recipe.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Recipe not found!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during fetching recipe: {e}'})    

@require_http_methods(["GET"])
def display_recipe(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        ingredients = Ingredient.objects.filter(recipe=recipe)
        return render(request, 'manage_recipe.html', {
            'recipe': recipe,
            'ingredients': ingredients
        })
    except Recipe.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Recipe not found!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during displaying recipe: {e}'})

@csrf_exempt
@require_http_methods(["PUT"])
def edit_recipe(request, recipe_id):
    try:
        data = json.loads(request.body)
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.name = data.get('name', recipe.name)
        recipe.course = data.get('course', recipe.course)
        recipe.rate = data.get('rate', recipe.rate)
        recipe.duration = data.get('duration', recipe.duration)
        recipe.description = data.get('description', recipe.description)
        recipe.instructions = data.get('instructions', recipe.instructions)
        recipeImage = data.get('image')

        if recipeImage and ';base64,' in recipeImage:
            format, imgstr = recipeImage.split(';base64,') 
            ext = format.split('/')[-1]  

            filename = f"{uuid.uuid4()}.{ext}"
            image_file = ContentFile(base64.b64decode(imgstr), name=filename)
            recipe.image = image_file

        recipe.save()

        ingredients = data.get('ingredients', [])
        for ing in ingredients:
            Ingredient.objects.create(
                recipe=recipe,
                name=ing.get('name'),
                quantity=ing.get('quantity')
            )

        url = reverse('view_recipes')
        
        return JsonResponse({'success': True, 'message': 'Recipe updated successfully!', 'url': url})
    except Recipe.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Recipe not found!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during updating recipe: {e}'})