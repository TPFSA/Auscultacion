from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PiezometroDataDistView, InclinometroDataDistView, SensorDataDistFilterView

# Crear un router para el ModelViewSet
router = DefaultRouter()
router.register(r'sensor_data_piezometro', PiezometroDataDistView, basename='sensor_data_piezometro')
router.register(r'sensor_data_inclinometro', InclinometroDataDistView, basename='sensor_data_inclinometro')

urlpatterns = [
    path("", include(router.urls)),  # Registrar el ModelViewSet

    # Registrar el APIView para POST
    path("sensor_data_piezometro/filter/", SensorDataDistFilterView.as_view(), name="sensor_data_piezometro_filter"),
]
