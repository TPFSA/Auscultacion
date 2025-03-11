from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SensorDataDistView, SensorDataDistFilterView

# Crear un router para el ModelViewSet
router = DefaultRouter()
router.register(r'sensor_data_dist', SensorDataDistView, basename='sensor_data_dist')

urlpatterns = [
    path("", include(router.urls)),  # Registrar el ModelViewSet

    # Registrar el APIView para POST
    path("sensor_data/filter/", SensorDataDistFilterView.as_view(), name="sensor_data_dist_filter"),
]
