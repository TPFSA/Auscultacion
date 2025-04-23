from django.db import models
from project.models import Project

class Sensor(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)  # Para indicar si es piezometro, temperatura, etc.
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    coord = models.JSONField(null=True, blank=True)

    class Meta:
        abstract = True  # Este modelo no se creará directamente en la base de datos

    def __str__(self):
        return self.name

# Modelo para Piezometro (sensor específico)
class Piezometro(Sensor):
    cotaZ = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    cotaInicial = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    
    
class Inclinometro(Sensor):
    cota = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    cotaI = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    

 