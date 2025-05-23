from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'piezometro', views.PiezometroView, 'piezometro')
router.register(r'inclinometro', views.InclinometroView, 'inclinometro')
router.register(r'sensor-coord', views.SensorCoordUpdateView, basename='sensor-coord')

urlpatterns = [
    path("", include(router.urls)),
]