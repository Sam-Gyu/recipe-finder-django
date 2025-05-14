from django.contrib import admin
from .models import Recipe, Ingredient

class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1

class RecipeAdmin(admin.ModelAdmin):
    inlines = [IngredientInline]

# Register your models here.
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Ingredient)