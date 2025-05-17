from django.db import models

# Create your models here.


class Recipe(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    course = models.TextField(null=True)
    duration = models.TextField(null=True) 
    rate = models.IntegerField(null=True)
    instructions = models.TextField(null=True)
    image = models.ImageField(upload_to='recipes/%y/%m/%d/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients', null=True)
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} of {self.name}"