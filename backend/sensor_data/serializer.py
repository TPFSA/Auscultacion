from rest_framework import serializers
from .models import Sensor_data_piezometro, Sensor_data_inclinometro

class Sensor_data_piezometro_serializer (serializers.ModelSerializer):
    sensor_name = serializers.CharField(source="sensor.name", read_only=True)
    class Meta:
        model = Sensor_data_piezometro
        fields =  ["id", "sensor", "sensor_name", "date", "valActual", "valDiferencia"]
        
class Sensor_data_inclinometro_serializer (serializers.ModelSerializer):
    sensor_name = serializers.CharField(source="sensor.name", read_only=True)
    class Meta:
        model = Sensor_data_inclinometro
        fields =  ["id", "sensor", "sensor_name", "date"]
