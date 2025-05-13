from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    