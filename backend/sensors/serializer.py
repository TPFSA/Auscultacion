from rest_framework import serializers
from .models import Sensor

class SensorSerializer (serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

class SensorCoordSerializer (serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ['coord']