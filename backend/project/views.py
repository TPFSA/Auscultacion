from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Project
from .serializer import ProjectSerializer

class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    authentication_classes = [JWTAuthentication] 
