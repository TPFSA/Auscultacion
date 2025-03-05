from rest_framework import serializers
from .models import Sensor_data_dist

class Sensor_data_dist_serializer (serializers.ModelSerializer):
    class Meta:
        model = Sensor_data_dist
        fields = '__all__'
