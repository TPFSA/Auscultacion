from rest_framework import serializers
from .models import Piezometro, Inclinometro

class PiezometroSerializer (serializers.ModelSerializer):
    class Meta:
        model = Piezometro
        fields = '__all__'
        
class SensorCoordSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['coord']  # Solo incluir el campo 'coord'

    def __init__(self, *args, **kwargs):
        """
        Modificamos el serializer para aceptar diferentes modelos concretos.
        El modelo se definirá dinámicamente en el viewset.
        """
        # Usamos el modelo concreto adecuado dependiendo de qué tipo de sensor estamos trabajando
        sensor_type = kwargs.get('context', {}).get('sensor_type', None)

        if sensor_type == 'piezometro':
            self.Meta.model = Piezometro
        else:
            raise ValueError("Tipo de sensor no válido")

        super().__init__(*args, **kwargs)
        
class InclimonetroSerializer (serializers.ModelSerializer):
    class Meta:
        model = Inclinometro
        fields = '__all__'