from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from apps.login import views

urlpatterns = [
    path('login/', views.login),
    path('signup/', views.signup),
]
