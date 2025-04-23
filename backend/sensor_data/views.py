from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Sensor_data_piezometro, Sensor_data_inclinometro
from .serializer import Sensor_data_piezometro_serializer, Sensor_data_inclinometro_serializer

# ✅ ModelViewSet para CRUD (GET, POST, PUT, DELETE)
class PiezometroDataDistView(viewsets.ModelViewSet):
    serializer_class = Sensor_data_piezometro_serializer
    queryset = Sensor_data_piezometro.objects.all()
    authentication_classes = [JWTAuthentication]
    
class InclinometroDataDistView(viewsets.ModelViewSet):
    serializer_class = Sensor_data_inclinometro_serializer
    queryset = Sensor_data_inclinometro.objects.all()
    authentication_classes = [JWTAuthentication]

# ✅ APIView para filtrar sensores con un POST
class SensorDataDistFilterView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        ids = request.data.get("ids", [])  # Obtener lista de IDs desde JSON
        if not isinstance(ids, list) or not ids:
            return Response({"error": "Se requiere una lista de IDs"}, status=status.HTTP_400_BAD_REQUEST)

        sensors = Sensor_data_piezometro.objects.filter(sensor_id__in=ids)
        serializer = Sensor_data_piezometro_serializer(sensors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
