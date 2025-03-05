from rest_framework import viewsets, mixins
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Sensor
from .serializer import SensorSerializer, SensorCoordSerializer

class SensorView(viewsets.ModelViewSet):
    serializer_class = SensorSerializer
    queryset = Sensor.objects.all()
    authentication_classes = [JWTAuthentication] 

    def get_queryset(self):
        """
        Filtra los sensores por el parámetro `project_id` en la URL.
        Si no se proporciona `project_id`, devuelve todos los sensores.
        """
        queryset = Sensor.objects.all()
        project_id = self.request.query_params.get('project_id', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
    
class SensorCoordUpdateView(viewsets.GenericViewSet, mixins.UpdateModelMixin):
    serializer_class = SensorCoordSerializer
    queryset = Sensor.objects.all()
    authentication_classes = [JWTAuthentication] 

    def partial_update(self, request, *args, **kwargs):
        """Permite actualizar solo el campo 'coord'."""
        return super().partial_update(request, *args, **kwargs)