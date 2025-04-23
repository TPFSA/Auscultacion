from django.db import models
from sensors.models import Piezometro,Inclinometro

# Create your models here.
class Sensor_data_piezometro(models.Model):
    sensor_piezometro = models.ForeignKey(Piezometro, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    valActual = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    valDiferencia = models.DecimalField(max_digits=10, decimal_places=6, null=True)

    def save(self, *args, **kwargs):
        if self.valActual is not None and self.sensor.valInicial is not None:
            self.valDiferencia = self.sensor.valInicial - self.valActual
        super().save(*args, **kwargs)
        
class Sensor_data_inclinometro(models.Model):
    sensor_inclinometro = models.ForeignKey(Inclinometro, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    valActual = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    valDiferencia = models.DecimalField(max_digits=10, decimal_places=6, null=True)

    def save(self, *args, **kwargs):
        if self.valActual is not None and self.sensor.valInicial is not None:
            self.valDiferencia = self.sensor.valInicial - self.valActual
        super().save(*args, **kwargs)