from django.db import models
from django.conf import settings

class Recipe(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    name = models.CharField(max_length=255)
    course = models.CharField(max_length=100)
    description = models.TextField()
    instructions = models.TextField()
    duration = models.IntegerField()
    rate = models.FloatField(default=0)
    image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    
    def _str_(self):
        return self.name

class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100)
    
    def _str_(self):
        return f"{self.quantity} of {self.name}"