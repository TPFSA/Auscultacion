from django.db import models
from project.models import Project

# Create your models here.
class Sensor(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)  # Ejemplo: temperatura, humedad, etc.
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    
    def __str__(self):
        return self.name