from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'', views.SensorDataDistView, 'sensor_data_dist')

urlpatterns = [
    path("sensor_data_dist/", include(router.urls)),
]