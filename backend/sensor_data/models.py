from django.db import models
from sensors.models import Sensor

# Create your models here.
class Sensor_data_dist(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    date = models.DateField()
    valActual = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    valDiferncia = models.DecimalField(max_digits=10, decimal_places=6, null=True)
