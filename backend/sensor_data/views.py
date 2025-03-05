from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Sensor_data_dist
from .serializer import Sensor_data_dist_serializer

class SensorDataDistView(viewsets.ModelViewSet):
    serializer_class = Sensor_data_dist_serializer
    queryset = Sensor_data_dist.objects.all()
    authentication_classes = [JWTAuthentication] 
