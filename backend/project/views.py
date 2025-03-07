from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Project
from .serializer import ProjectSerializer

class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    authentication_classes = [JWTAuthentication] 
    
    def get_queryset(self):
            user = self.request.user  # Usuario autenticado

        # Si el usuario es admin, devuelve todos los proyectos
            if user.is_authenticated and user.is_staff:
                return Project.objects.all()

            # Si no es admin, filtrar los proyectos que pertenecen al usuario autenticado
            return Project.objects.filter(user_id=user.id)