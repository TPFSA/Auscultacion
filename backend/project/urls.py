from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from . import views

router = routers.DefaultRouter()
router.register(r'project', views.ProjectView, 'project')
router.register(r'project-finish', views.FinishedUpdateView, 'project-finish')

urlpatterns = [
    path("", include(router.urls)),
]