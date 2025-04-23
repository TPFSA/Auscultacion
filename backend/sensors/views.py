from rest_framework import viewsets, mixins
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Piezometro, Inclinometro
from .serializer import PiezometroSerializer, SensorCoordSerializer, InclimonetroSerializer
from django.apps import apps

class PiezometroView(viewsets.ModelViewSet):
    serializer_class = PiezometroSerializer
    queryset = Piezometro.objects.all()
    authentication_classes = [JWTAuthentication] 

    def get_queryset(self):
        """
        Filtra los sensores por el parámetro `project_id` en la URL.
        Si no se proporciona `project_id`, devuelve todos los sensores.
        """
        queryset = Piezometro.objects.all()
        project_id = self.request.query_params.get('project_id', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
    
class InclinometroView(viewsets.ModelViewSet):
    serializer_class = InclimonetroSerializer
    queryset = Inclinometro.objects.all()
    authentication_classes = [JWTAuthentication] 

    def get_queryset(self):
        """
        Filtra los sensores por el parámetro `project_id` en la URL.
        Si no se proporciona `project_id`, devuelve todos los sensores.
        """
        queryset = Inclinometro.objects.all()
        project_id = self.request.query_params.get('project_id', None)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
    
class SensorCoordUpdateView(viewsets.GenericViewSet, mixins.UpdateModelMixin):
    serializer_class = SensorCoordSerializer
    authentication_classes = [JWTAuthentication] 

    def get_queryset(self):
        sensor_type = self.request.query_params.get('sensor_type', None)

        # Aquí seleccionamos el queryset adecuado dependiendo del tipo de sensor
        if sensor_type == 'piezometro':
            return Piezometro.objects.all()
    # queryset = Sensor.objects.all()
    def partial_update(self, request, *args, **kwargs):
        """Permite actualizar solo el campo 'coord'."""
        return super().partial_update(request, *args, **kwargs)
    
 
class SensorCoordUpdateView(viewsets.GenericViewSet, mixins.UpdateModelMixin):
    serializer_class = SensorCoordSerializer
    authentication_classes = [JWTAuthentication]
    def get_queryset(self):
        
        sensor_type = self.request.query_params.get('sensor_type', None)
        # Diccionario que mapea el tipo de sensor al modelo correspondiente
        
        sensor_models = {
            'piezometro': 'app_name.Piezometro',  # Reemplaza 'app_name' con el nombre de tu aplicación
            'otro_sensor': 'app_name.OtroSensor',  # Puedes añadir más sensores aquí
            # Agrega otros modelos según sea necesario
        }
        
        if sensor_type:
            # Obtenemos el modelo correspondiente usando el nombre del modelo
            model_path = sensor_models.get(sensor_type)
            if model_path:
                # Usamos `apps.get_model` para obtener el modelo dinámicamente
                model = apps.get_model(model_path)
                return model.objects.all()
 
    def partial_update(self, request, *args, **kwargs):
        """Permite actualizar solo el campo 'coord'."""
        return super().partial_update(request, *args, **kwargs)

 