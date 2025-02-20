from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.process_excel, name='process_excel'),
]
